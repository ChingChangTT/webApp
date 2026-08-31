import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, signal } from '@angular/core';

export interface MapAddressSelection {
  address?: string;
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    __BEAUTIFO_CONFIG__?: { googleMapsApiKey?: string };
    google?: any;
    __beautifoGoogleMapsReady?: () => void;
  }
}

let googleMapsLoadPromise: Promise<void> | undefined;

@Component({
  selector: 'app-google-map-picker',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-xl border border-gray-200 my-6">
      @if (errorMessage()) {
        <div class="bg-amber-50 p-4 text-sm text-amber-800">{{ errorMessage() }}</div>
      } @else {
        <div class="relative h-64 w-full bg-gray-100">
          <div #mapContainer class="h-full w-full" aria-label="Select delivery location on Google Maps"></div>
          @if (mapLoading()) {
            <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 text-sm font-medium text-gray-700">
              <div class="h-9 w-9 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
              Loading Google Maps…
            </div>
          }
        </div>
        <div class="flex items-center justify-between gap-3 border-t border-gray-200 bg-white p-3 my-6">
          <div class="flex items-center gap-2 text-xs text-gray-500">
            @if (addressLoading()) {
              <div class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500"></div>
            }
            <p>{{ selectionMessage() || (mapLoading() ? 'Please wait while the map loads.' : 'Click the map to choose your exact delivery point.') }}</p>
          </div>
          <button type="button" (click)="useCurrentLocation()" [disabled]="mapLoading() || addressLoading()" class="shrink-0 rounded-lg border border-pink-500 px-3 py-2 text-xs font-semibold text-pink-500 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400">
            {{ mapLoading() ? 'Loading map…' : addressLoading() ? 'Finding address…' : 'Use my location' }}
          </button>
        </div>
        <p class="border-t border-gray-100 bg-white px-3 py-2 text-[10px] text-gray-400">
          Address data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="underline">OpenStreetMap contributors</a>
        </p>
      }
    </div>
  `
})
export class GoogleMapPickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') private mapContainer?: ElementRef<HTMLDivElement>;
  @Output() readonly addressSelected = new EventEmitter<MapAddressSelection>();
  readonly errorMessage = signal('');
  readonly selectionMessage = signal('');
  readonly mapLoading = signal(true);
  readonly addressLoading = signal(false);

  private map: any;
  private marker: any;
  private clickListener?: { remove: () => void };
  private lookupSequence = 0;
  private lastLookupAt = 0;

  async ngAfterViewInit(): Promise<void> {
    const apiKey = window.__BEAUTIFO_CONFIG__?.googleMapsApiKey;
    if (!apiKey) {
      this.errorMessage.set('Add GOOGLE_MAPS_API_KEY to .env.local, then restart the app to enable the map.');
      this.mapLoading.set(false);
      return;
    }

    try {
      await this.loadGoogleMaps(apiKey);
      const mapsLibrary = await window.google.maps.importLibrary('maps');
      const markerLibrary = await window.google.maps.importLibrary('marker');
      const center = { lat: 11.5564, lng: 104.9282 };

      this.map = new mapsLibrary.Map(this.mapContainer?.nativeElement, {
        center,
        zoom: 13,
        mapId: 'DEMO_MAP_ID',
        streetViewControl: false,
        mapTypeControl: false
      });
      this.marker = new markerLibrary.AdvancedMarkerElement({ map: this.map, position: center });
      this.clickListener = this.map.addListener('click', (event: any) => {
        if (event.latLng) void this.selectPosition(event.latLng.lat(), event.latLng.lng());
      });
      this.mapLoading.set(false);
    } catch {
      this.errorMessage.set('Google Maps could not load. Check the API key restrictions and enabled APIs.');
      this.mapLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clickListener?.remove();
  }

  useCurrentLocation(): void {
    if (this.mapLoading() || !this.map || !this.marker) {
      this.selectionMessage.set('Please wait until Google Maps has finished loading.');
      return;
    }
    if (!navigator.geolocation) {
      this.errorMessage.set('Location access is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => void this.selectPosition(position.coords.latitude, position.coords.longitude),
      () => this.selectionMessage.set('Allow location access in your browser, or click a location on the map.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  private async selectPosition(latitude: number, longitude: number): Promise<void> {
    if (this.addressLoading()) return;

    const position = { lat: latitude, lng: longitude };
    this.marker.position = position;
    this.map.panTo(position);
    // Save coordinates internally, but do not show them as the delivery address.
    this.addressSelected.emit({ latitude, longitude });
    this.addressLoading.set(true);
    this.selectionMessage.set('Location selected. Finding the address name…');

    try {
      const address = await this.reverseGeocode(latitude, longitude);
      if (address) {
        this.addressSelected.emit({ address, latitude, longitude });
        this.selectionMessage.set('Delivery address updated from the selected location.');
      } else {
        this.selectionMessage.set('Google could not find an address name for this point. Please enter the address manually.');
      }
    } catch {
      this.selectionMessage.set('Address lookup failed. Please try again or enter the address manually.');
    } finally {
      this.addressLoading.set(false);
    }
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<string | undefined> {
    const sequence = ++this.lookupSequence;
    await new Promise(resolve => setTimeout(resolve, 600));
    if (sequence !== this.lookupSequence) return undefined;

    const waitTime = Math.max(0, 1000 - (Date.now() - this.lastLookupAt));
    if (waitTime) await new Promise(resolve => setTimeout(resolve, waitTime));
    this.lastLookupAt = Date.now();

    const parameters = new URLSearchParams({
      format: 'jsonv2',
      lat: latitude.toString(),
      lon: longitude.toString(),
      zoom: '18',
      addressdetails: '1',
      'accept-language': 'en'
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${parameters}`);
    if (!response.ok) throw new Error('Address lookup failed');
    const result = await response.json() as { display_name?: string };
    return result.display_name;
  }

  private loadGoogleMaps(apiKey: string): Promise<void> {
    if (window.google?.maps?.importLibrary) return Promise.resolve();
    if (googleMapsLoadPromise) return googleMapsLoadPromise;

    googleMapsLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.dataset['beautifoGoogleMaps'] = 'true';
      window.__beautifoGoogleMapsReady = () => {
        delete window.__beautifoGoogleMapsReady;
        resolve();
      };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly&callback=__beautifoGoogleMapsReady`;
      script.async = true;
      script.onerror = () => {
        delete window.__beautifoGoogleMapsReady;
        googleMapsLoadPromise = undefined;
        script.remove();
        reject(new Error('Google Maps failed to load'));
      };
      document.head.appendChild(script);
    });
    return googleMapsLoadPromise;
  }
}

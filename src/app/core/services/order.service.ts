import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models';

export type DeliveryStatus = 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered';

export interface DeliveryOrder {
  id: string;
  items: Product[];
  total: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
  deliveryArea: string;
  paymentMethod: 'card' | 'cash-on-delivery';
  deliveryLatitude: number | null;
  deliveryLongitude: number | null;
  createdAt: string;
  estimatedArrival: string;
  status: DeliveryStatus;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'beautifo-latest-order';
  private readonly orderSubject = new BehaviorSubject<DeliveryOrder | null>(this.readOrder());
  readonly currentOrder$ = this.orderSubject.asObservable();

  createOrder(
    items: Product[],
    total: number,
    fullName: string,
    phoneNumber: string,
    email: string,
    deliveryAddress: string,
    deliveryArea: string,
    paymentMethod: 'card' | 'cash-on-delivery',
    deliveryLatitude: number | null,
    deliveryLongitude: number | null
  ): DeliveryOrder {
    const arrival = new Date();
    arrival.setDate(arrival.getDate() + 3);

    const order: DeliveryOrder = {
      id: `BTF-${Date.now().toString().slice(-8)}`,
      items: items.map(item => ({ ...item })),
      total,
      fullName,
      phoneNumber,
      email,
      deliveryAddress,
      deliveryArea,
      paymentMethod,
      deliveryLatitude,
      deliveryLongitude,
      createdAt: new Date().toISOString(),
      estimatedArrival: arrival.toISOString(),
      status: 'confirmed'
    };

    this.orderSubject.next(order);
    localStorage.setItem(this.storageKey, JSON.stringify(order));
    return order;
  }

  advanceDemoStatus(): void {
    const order = this.orderSubject.value;
    if (!order) return;

    const statuses: DeliveryStatus[] = ['confirmed', 'shipped', 'out-for-delivery', 'delivered'];
    const nextStatus = statuses[Math.min(statuses.indexOf(order.status) + 1, statuses.length - 1)];
    const updatedOrder = { ...order, status: nextStatus };
    this.orderSubject.next(updatedOrder);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedOrder));
  }

  private readOrder(): DeliveryOrder | null {
    try {
      const storedOrder = localStorage.getItem(this.storageKey);
      return storedOrder ? JSON.parse(storedOrder) as DeliveryOrder : null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}

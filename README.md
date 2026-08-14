Act as a Senior Frontend Angular Developer. Help me design and implement an e-commerce home page for a beauty brand ("BEAUTIFO") matching a modern, clean aesthetic with soft pink accents. 

Please follow a strict MVC-style architecture in Angular by separating Models (Interfaces & Services), Views (Templates & Styles), and Controllers (Component TS files).

### Design Specifications & Aesthetics:
- **Color Palette**: Pastel pinks, soft neutrals/white, elegant dark gray text, subtle green accents for organic items.
- **Typography**: Clean serif titles combined with modern sans-serif body text.
- **Layout Structure**:
  1. Top Bar & Navigation (Logo, Search, Wishlist, Cart, Profile, Nav Links).
  2. Hero Banner (Split view with main CTA, promotional copy, and product image).
  3. Secondary Banners (2-column layout for "Natural Beauty Collection" and "Hair Mask").
  4. Featured Products Grid (Filter tabs: All, For Face, For Body, For Hair, Accessories + 4x2 grid with star ratings, badges, hover effects).
  5. Promotional Banner Grid (Asymmetric layout featuring special offers and treatments).
  6. Sidebar Product Columns (Best Seller, Top Rated, On Sale listing cards).
  7. Newsletter Subscription Section (Input field + primary CTA button).
  8. Brand Logo Carousel / Grid.
  9. Instagram Gallery Feed (4-image grid).
  10. Value Propositions Section (Free Deluxe Samples, Earn Reward Points, Free Delivery icons).
  11. Multi-column Footer.

### Architecture & Code Requirements:

1. **MODEL LAYER**:
   - Create TypeScript interfaces for `Product`, `Category`, `Banner`, and `Review`.
   - Create mock services (`ProductService`) using RxJS BehaviorSubjects or Angular Signals to handle state management (fetching products, filtering by category, cart management).

2. **CONTROLLER LAYER**:
   - Implement modular Standalone Components (or Feature Modules):
     - `HeaderComponent`
     - `HeroSectionComponent`
     - `ProductCardComponent`
     - `ProductGridComponent`
     - `NewsletterComponent`
     - `FooterComponent`
   - Use smart/dumb component patterns (Container components for state/controller logic, Presentational components for UI rendering).

3. **VIEW LAYER**:
   - Provide HTML templates (`.component.html`) using semantic HTML5 elements.
   - Provide Tailwind CSS classes (or SCSS) for responsive layout, spacing, and hover effects.

Please generate the complete file structure and starting code for the models, services, main components, and styling.
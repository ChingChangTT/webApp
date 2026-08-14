export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  cta: string;
  link: string;
  type: 'hero' | 'secondary' | 'promotional';
  position?: 'left' | 'right';
}

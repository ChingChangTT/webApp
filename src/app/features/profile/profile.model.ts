
export interface profileUser{
  id:string;
  email: string;
  firstName : string;
  lastName: string;
  sex:string;
  dob:Date | null;
  avatarUrl?: string;
  coverUrl?: string;
} 
export interface AllData{
  userProfile:profileUser | null
}

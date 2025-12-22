import { IsString } from 'class-validator';
export class ReferrerResponse {
  referrarId?: string;
  referrerfullname?: string;
  referrarUsername?: string;
}

export class ReferredUsersResponse {
    id?: string;
    referredUserId?: string;
    referredUserFullName?: string;
    referredUserUsername?: string;
}

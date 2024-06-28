import { redirect } from "next/navigation";

import { ProfileRouteParams } from "challenges/types/profile-navigation.types";

export default function ProfileTabUnknown({ params }: { params: ProfileRouteParams }) {
   redirect(`/profile/${params.region}/${params.summoner}`);
}

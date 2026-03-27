import { apiFetch } from './api';
import type { HomeSection, Homepage, Promotion, StrapiListResponse, StrapiSingleResponse } from '@/types';

export async function getHomepage(): Promise<Homepage | null> {
  try {
    const res = await apiFetch<StrapiSingleResponse<Homepage>>(
      '/homepage?populate[hero][populate][heroMedia][fields][0]=url&populate[hero][populate][heroMedia][fields][1]=alternativeText&populate[hero][populate][heroMedia][fields][2]=width&populate[hero][populate][heroMedia][fields][3]=height&populate[hero][populate][heroMedia][fields][4]=mime',
      { tags: ['homepage'], revalidate: 120 },
    );
    return (res?.data as Homepage) ?? null;
  } catch {
    return null;
  }
}

export async function getHomeSection(): Promise<HomeSection | null> {
  try {
    const res = await apiFetch<StrapiSingleResponse<HomeSection>>(
      '/home-section?populate[heroBanners][populate][image][fields][0]=url&populate[heroBanners][populate][image][fields][1]=alternativeText&populate[heroBanners][populate][image][fields][2]=width&populate[heroBanners][populate][image][fields][3]=height&populate[heroBanners][populate][mobileImage][fields][0]=url&populate[heroBanners][populate][mobileImage][fields][1]=alternativeText&populate[promotionalBanners][populate][image][fields][0]=url&populate[promotionalBanners][populate][image][fields][1]=alternativeText&populate[promotionalBanners][populate][image][fields][2]=width&populate[promotionalBanners][populate][image][fields][3]=height&populate[promotionalBanners][populate][mobileImage][fields][0]=url&populate[promotionalBanners][populate][mobileImage][fields][1]=alternativeText&populate[categoryHighlights][populate][image][fields][0]=url&populate[categoryHighlights][populate][image][fields][1]=alternativeText&populate[categoryHighlights][populate][image][fields][2]=width&populate[categoryHighlights][populate][image][fields][3]=height',
      { tags: ['home-section'], revalidate: 120 },
    );
    return res?.data as unknown as HomeSection ?? null;
  } catch {
    return null;
  }
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const now = new Date().toISOString();
  const res = await apiFetch<StrapiListResponse<Promotion>>(
    `/promotions?filters[active][$eq]=true&filters[$or][0][endDate][$gte]=${now}&filters[$or][1][endDate][$null]=true&populate[banner][fields][0]=url&populate[banner][fields][1]=alternativeText&populate[banner][fields][2]=width&populate[banner][fields][3]=height&populate[mobileBanner][fields][0]=url&populate[mobileBanner][fields][1]=alternativeText&sort=sortOrder:asc&status=published`,
    { tags: ['promotions'], revalidate: 60 },
  );
  return (res?.data as Promotion[]) ?? [];
}

import { Wine } from '../wine'

export type FeaturedWineProps = {
  wine: Wine
  bannerImage: string
  resolveImage: (wineId: string) => string
}

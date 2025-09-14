import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export function getImagePlaceholder(id: string): ImagePlaceholder {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return {
        id: 'default',
        description: 'Default placeholder image',
        imageUrl: 'https://picsum.photos/seed/default/600/400',
        imageHint: 'placeholder'
    }
  }
  return image;
}

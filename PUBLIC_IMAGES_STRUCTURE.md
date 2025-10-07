# Public Images Folder Structure

Create the following folder structure in your `public` directory:

```
public/
└── images/
    └── stories/
        ├── tech-meetup-1.jpg
        ├── tech-meetup-2.jpg
        ├── tech-meetup-3.jpg
        ├── garden-project-1.jpg
        ├── garden-project-2.jpg
        ├── garden-project-3.jpg
        ├── garden-project-4.jpg
        ├── coding-workshop-1.jpg
        ├── coding-workshop-2.jpg
        ├── charity-gala-1.jpg
        ├── charity-gala-2.jpg
        ├── charity-gala-3.jpg
        ├── startup-pitch-1.jpg
        ├── family-fun-1.jpg
        ├── women-tech-1.jpg
        ├── cleanup-drive-1.jpg
        └── food-drive-1.jpg
```

## Image Guidelines

### Recommended Specifications:
- **Format**: JPG or PNG
- **Size**: 800x600px minimum
- **Aspect Ratio**: Various (the gallery will adapt)
- **File Size**: Under 500KB each for optimal loading

### Naming Convention:
- Use descriptive names with hyphens
- Include event type and number
- Example: `tech-meetup-1.jpg`, `garden-project-2.jpg`

### Gallery Behavior:
- **Gallery View**: Shows multiple images in collages
  - 1 image: Single image
  - 2 images: Side by side
  - 3 images: One large + two small
  - 4+ images: 2x2 grid with "+X more" overlay

- **Grid View**: Shows only the first image (single image display)

### Adding New Stories:
When adding new stories, update the `stories` array in `StoriesSection.tsx`:

```javascript
{
  id: 10,
  title: "New Event",
  category: "Category",
  date: "Date",
  location: "Location",
  attendees: 50,
  image: "/images/stories/new-event-1.jpg", // First image for grid view
  images: [ // Multiple images for gallery view
    "/images/stories/new-event-1.jpg",
    "/images/stories/new-event-2.jpg",
    "/images/stories/new-event-3.jpg"
  ],
  description: "Event description...",
  highlights: ["Highlight 1", "Highlight 2"],
  tags: ["Tag1", "Tag2"],
  likes: 0
}
```

## Features

### Multi-Image Gallery:
- **Collage Display**: Automatically creates beautiful collages based on image count
- **Lightbox**: Click any image to open full-screen lightbox with navigation
- **Responsive**: Adapts to different screen sizes
- **Hover Effects**: Smooth transitions and scaling

### Single Image Grid:
- **Clean Display**: Shows only the primary image in grid view
- **Consistent Layout**: Maintains uniform card appearance
- **Fast Loading**: Loads only necessary images

Place your images in the `public/images/stories/` folder and they'll be automatically served by your application!
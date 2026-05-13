# 📸 Gallery Management System - Setup Guide

## Overview

Your app now has a professional **Before/After Gallery System** for showcasing design transformations and allowing users to browse sample interiors and use them as inspiration for their own designs.

### Architecture

```
Gallery System
├── Frontend
│   ├── GalleryBeforeAfter.tsx     (Interactive slider component)
│   ├── galleryBrowse.tsx          (Public gallery view)
│   └── adminGallery.tsx           (Admin upload & management)
├── Backend
│   ├── GalleryItem                 (Main gallery project)
│   ├── GalleryImage                (Before/After images by style)
│   ├── gallery.service.ts          (Business logic)
│   ├── gallery.controller.ts       (API endpoints)
│   └── gallery.routes.ts           (Route definitions)
└── Storage
    └── Cloudinary                   (Image hosting)
```

---

## 🚀 Quick Start

### 1. Access the Gallery

#### For Users:
- Open your app and tap **Gallery** in the bottom navigation
- Browse before/after samples organized by interior style (Modern, Minimalist, Luxury, etc.)
- Use the interactive slider to compare transformations
- Click **"Use This Style"** to load a sample image for your design

#### For Admins:
- On the Home screen, tap your profile → **Admin Gallery**
- Or navigate directly to `/adminGallery`

---

## 📁 Folder Structure (Cloudinary)

Images are automatically organized in Cloudinary under:

```
/gallery/
├── {gallery-item-id}/
│   ├── before/
│   │   └── 1.jpg (single before image)
│   └── after/
│       ├── modern/
│       │   ├── 1.jpg
│       │   └── 2.jpg (if multiple versions)
│       ├── minimalist/
│       │   └── 1.jpg
│       ├── luxury/
│       │   └── 1.jpg
│       └── ... (other styles)
```

**Example:**
```
/gallery/abc123def456/
├── before/1.jpg (Living Room - Before)
└── after/
   ├── modern/1.jpg
   ├── minimalist/1.jpg
   └── luxury/1.jpg
```

---

## 🛠️ Admin: Upload Images

### Step 1: Create a Gallery Item
1. Go to **Admin Gallery**
2. Tap **"Create New Gallery Item"**
3. Enter a title (e.g., "Master Bedroom Redesign")
4. Confirm

### Step 2: Upload Before Image
1. In the gallery item, tap **"Upload Before Image"**
2. Select the original room photo
3. Wait for upload confirmation

### Step 3: Upload After Images (by Style)
1. Select the design style (Modern, Minimalist, Luxury, etc.)
2. Tap **"Upload [Style] Image"**
3. Select the after transformation photo
4. Repeat for each style you want to showcase

### Result
Users will see:
- 1 before image
- 1-10 after images (one per style)
- Interactive slider to compare each style with before

---

## 🎨 Supported Styles

The system supports these interior design styles:

1. **Modern** - Clean lines, contemporary aesthetics
2. **Minimalist** - Simple, uncluttered spaces
3. **Scandinavian** - Light, functional Nordic design
4. **Luxury** - High-end, elegant aesthetics
5. **Industrial** - Raw materials, exposed elements
6. **Bohemian** - Eclectic, artistic, carefree vibes
7. **Rustic** - Natural, cozy, countryside charm
8. **Contemporary** - Current trendy design
9. **Traditional** - Classic, timeless style
10. **Classical** - Ornate, historical influences

✅ To add more styles, update the `STYLE_OPTIONS` array in `adminGallery.tsx` and regenerate images.

---

## 📊 Database Schema

### GalleryItem
```sql
- id: UUID (primary key)
- title: String (e.g., "Living Room Makeover")
- createdAt: DateTime
- updatedAt: DateTime
- images: GalleryImage[] (relation)
```

### GalleryImage
```sql
- id: UUID (primary key)
- itemId: UUID (foreign key → GalleryItem)
- type: String ("before" OR "after")
- style: String (null for before, specific style for after)
- path: String (Cloudinary URL)
- publicId: String (Cloudinary internal ID)
- order: Int (sort position within style)
- createdAt: DateTime
- updatedAt: DateTime
```

---

## 🔌 API Endpoints

### Public Routes

#### Get All Gallery Items
```
GET /api/gallery
Response: { success: true, data: GalleryItem[], count: number }
```

#### Get Single Gallery Item
```
GET /api/gallery/:id
Response: { success: true, data: GalleryItem }
```

#### Get After Images by Style
```
GET /api/gallery/:id/after?style=modern
Response: { success: true, data: GalleryImage[] }
```

#### Get Supported Styles
```
GET /api/gallery/styles
Response: { success: true, data: string[], count: number }
```

### Admin Routes (Require `x-admin-secret` header)

#### Create Gallery Item
```
POST /api/gallery
Body: { title: string }
```

#### Upload Before Image
```
POST /api/gallery/:id/before
Form: image (file)
```

#### Upload After Image
```
POST /api/gallery/:id/after
Form: image (file), style (string)
```

#### Update Image Metadata
```
PATCH /api/gallery/images/:imageId
Body: { order?: number, style?: string }
```

#### Replace Image
```
PATCH /api/gallery/images/:imageId/replace
Form: image (file)
```

#### Delete Image
```
DELETE /api/gallery/images/:imageId
```

#### Delete Gallery Item
```
DELETE /api/gallery/:id
```

---

## 🔐 Security

### Admin Secret Header
All admin endpoints require:
```
Header: x-admin-secret: <secret-key>
```

To enable:
1. Set `ADMIN_SECRET` in `.env`
2. Backend validates this header via `requireAdminSecret` middleware

### User Roles
- **USER**: Can view gallery, browse samples
- **ADMIN**: Can create, upload, edit, delete gallery items

---

## 💡 Use Cases

### 1. Showcase Portfolio
Upload your best design transformations to inspire users.

### 2. Style Examples
Create separate gallery items for each room type:
- "Modern Kitchen"
- "Luxury Bedroom"
- "Industrial Office"

### 3. Before/After Comparison
Show how AI transforms spaces:
- Original photo → Modern style → Minimalist style → Luxury style

### 4. User Inspiration
Users can browse real examples before starting their own design.

---

## 🧪 Testing the Gallery

### Frontend Testing

1. **Start the app:**
   ```bash
   cd frontend
   npm start
   ```

2. **View Gallery:**
   - Navigate to Home → tap **Gallery** (bottom nav)
   - Should display: "No gallery items yet"

3. **Test Admin Upload:**
   - As admin, go to Admin Gallery
   - Create a new item: "Test Room"
   - Upload before image (any interior photo)
   - Upload after images for 2-3 styles
   - Go back to Gallery and verify the transformations appear

### Backend Testing

1. **Check gallery items:**
   ```bash
   curl http://localhost:3000/api/gallery
   ```

2. **Check single item:**
   ```bash
   curl http://localhost:3000/api/gallery/{item-id}
   ```

3. **Check styles:**
   ```bash
   curl http://localhost:3000/api/gallery/styles
   ```

---

## ⚠️ Troubleshooting

### Images not showing?
- Check Cloudinary URL format in response
- Verify Cloudinary account permissions
- Check CORS settings

### Can't upload as admin?
- Verify `x-admin-secret` header is set correctly
- Check user role is "ADMIN" in database
- Check file size isn't exceeding limit (usually 10MB)

### Slider not working?
- Check React Native Reanimated is installed: `expo install react-native-reanimated`
- Rebuild app with `expo prebuild`

### Styles not appearing?
- Create at least 2 styles for each gallery item
- Make sure `style` field is set when uploading "after" images

---

## 📋 Next Steps

1. ✅ **Create Sample Gallery Items**
   - Upload 2-3 before/after sets
   - Test each style

2. ✅ **Test User Flow**
   - Browse gallery
   - Use sample image to start design

3. ✅ **Customize Styles**
   - Add domain-specific styles to `STYLE_OPTIONS`
   - Update style naming to match your app

4. ✅ **Deploy**
   - Ensure Cloudinary API key is in production `.env`
   - Test on physical device
   - Monitor gallery performance

---

## 📞 Support

For issues:
- Check backend logs: `npm run dev` output
- Check frontend console: Hermes Debugger in Expo
- Review Cloudinary dashboard for upload errors
- Check database with: `npx prisma studio`

---

**Created:** April 4, 2026  
**Status:** ✅ Ready for Production

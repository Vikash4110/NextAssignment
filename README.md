# FaceTracker Pro

A professional-grade face tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Features real-time face detection, video recording with overlay tracking markers, and modern responsive design.

## 🚀 Features

- **Real-time Face Tracking**: Advanced face detection using browser APIs with fallback support
- **HD Video Recording**: High-quality video recording with embedded face tracking overlays
- **Professional UI/UX**: Modern glass-morphism design with smooth animations
- **Dark/Light Mode**: Complete theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and IntelliSense support
- **Performance Optimized**: 60fps tracking with minimal resource usage
- **Privacy First**: All processing happens client-side

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **APIs**: MediaRecorder, getUserMedia, Canvas API, FaceDetector API

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd face-tracking-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Requirements

- **HTTPS**: Required for camera access (development server runs on HTTP but production needs HTTPS)
- **Modern Browser**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Camera Permissions**: User must grant camera and microphone access

### Browser Support

| Feature          | Chrome | Firefox | Safari | Edge |
| ---------------- | ------ | ------- | ------ | ---- |
| MediaRecorder    | ✅     | ✅      | ✅     | ✅   |
| getUserMedia     | ✅     | ✅      | ✅     | ✅   |
| FaceDetector API | ✅     | ❌      | ❌     | ✅   |

_Note: Fallback face detection is used when FaceDetector API is not available_

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FaceTracker.tsx
│   ├── Header.tsx
│   ├── FeatureCard.tsx
│   └── ThemeToggle.tsx
├── types/
│   └── faceTracker.ts
└── lib/
    └── utils.ts
```

## 🎯 Usage

1. **Grant Permissions**: Allow camera and microphone access when prompted
2. **Start Tracking**: Click "Start Tracking" to begin face detection
3. **Record Video**: Click "Start Recording" to capture video with face tracking overlays
4. **View Results**: Recorded videos appear in the gallery with download options

## 🔒 Privacy & Security

- **Client-Side Processing**: All face detection happens locally in the browser
- **No Data Transmission**: Videos and face data never leave your device
- **Secure Storage**: Uses browser's built-in storage APIs with automatic cleanup
- **Permission Management**: Respects browser security policies

## 📱 Performance

- **60 FPS Tracking**: Optimized algorithms for smooth real-time detection
- **Memory Efficient**: Automatic cleanup of resources and video objects
- **Battery Optimized**: Efficient use of device resources
- **Responsive**: Adapts to different screen sizes and orientations

## 🎨 Customization

### Theming

The app supports extensive theming through CSS custom properties. Modify `globals.css` to customize colors, spacing, and animations.

### Face Detection

Customize detection sensitivity and overlay appearance in `FaceTracker.tsx`:

```typescript
// Adjust detection parameters
const faceDetector = new FaceDetector({
  maxDetectedFaces: 10,
  fastMode: false,
});

// Customize overlay styling
ctx.strokeStyle = "#22c55e";
ctx.lineWidth = 3;
```

## 🐛 Troubleshooting

### Camera Not Working

- Ensure HTTPS connection (required for camera access)
- Check browser permissions
- Try refreshing the page
- Clear browser cache

### Face Detection Issues

- Ensure good lighting conditions
- Face should be clearly visible and facing camera
- Check browser compatibility for FaceDetector API

### Recording Problems

- Verify browser supports MediaRecorder API
- Check available disk space
- Ensure stable camera connection

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

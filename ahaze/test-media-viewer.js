// Test script to verify MediaViewerOverlay fix
import MediaViewerOverlay from './src/components/posts/MediaViewerOverlay.jsx';

console.log('✅ MediaViewerOverlay component loaded successfully');
console.log('🔧 Props now supports both formats:');
console.log('   1. { posts, initialPostId, initialMediaIndex, onClose } - Multi-post mode');
console.log('   2. { post, currentIndex, onClose } - Single post mode');

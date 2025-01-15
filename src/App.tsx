import { useEffect, useRef, useState } from 'react';
import './App.css';
import { VIDEO_LINKS } from './constants';
import {
	Pause,
	Volume2,
	VolumeX,
	ChevronDown,
	ChevronUp,
	Share2,
} from 'lucide-react';

function ReelItem({ reel }: { reel: { url: string; caption: string } }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef(null);
	const [showPauseAnimation, setShowPauseAnimation] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					videoRef?.current?.play();
					setIsPlaying(true);
				} else {
					videoRef?.current?.pause();
					setIsPlaying(false);
				}
			},
			{ threshold: 0.5 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	const togglePlay = () => {
		if (isPlaying) {
			videoRef?.current?.pause();
			setShowPauseAnimation(true);
			// setTimeout(() => setShowPauseAnimation(false), 1000);
		} else {
			setShowPauseAnimation(false);
			videoRef?.current?.play();
		}
		setIsPlaying(!isPlaying);
	};

	const toggleMute = () => {
		if (!videoRef.current) return;

		videoRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	const handleShareClick = () => {
		alert('To be implemented');
	};

	return (
		<div>
			<div ref={containerRef} className='relative h-screen snap-start'>
				<video
					ref={videoRef}
					src={reel.url}
					className='w-full h-full object-cover'
					loop
					muted={isMuted}
					playsInline
					onClick={togglePlay}
				/>
				{showPauseAnimation && (
					<div
						className='absolute inset-0 flex items-center justify-center'
						onClick={togglePlay}>
						<div className='animate-[scale_1s_ease-out] bg-black/20 rounded-full p-8'>
							<Pause size={64} className='text-white' />
						</div>
					</div>
				)}
				<div className='absolute top-4 right-4 flex justify-between items-center text-white'>
					<button
						onClick={toggleMute}
						className='p-2 hover:bg-black/20 rounded-full'>
						{isMuted ? (
							<VolumeX size={24} />
						) : (
							<Volume2 size={24} />
						)}
					</button>
				</div>
				<div className='absolute bottom-4 left-4 right-4 flex justify-between items-center text-white'>
					<div className='text-lg font-medium'>{reel.caption}</div>
					<div
						className='p-2 hover:bg-black/20 rounded-full'
						onClick={handleShareClick}>
						<Share2 size={24} />
					</div>
				</div>
			</div>

			{/* Icon controls */}
			<div className='absolute right-10 top-10 flex flex-col justify-between'>
				<div
					className=' right-4 top-4 cursor-pointer hover:bg-black/20 rounded-full'
					onClick={() => {}}>
					<ChevronUp size={24} />
				</div>
			</div>
			<div className='absolute right-10 bottom-10 flex flex-col justify-between'>
				<div
					className=' right-4 top-4 cursor-pointer hover:bg-black/20 rounded-full'
					onClick={() => {}}>
					<ChevronDown size={24} />
				</div>
			</div>
		</div>
	);
}

const App = () => {
	const [isOpened, setIsOpened] = useState(false);

	return (
		<div className='h-screen overflow-y-scroll snap-y snap-mandatory w-full flex items-center justify-center'>
			{isOpened ? (
				<>
					<div className='player'>
						{VIDEO_LINKS.map((reel, id) => (
							<ReelItem key={id} reel={reel} />
						))}
						<div>End of reels</div>
					</div>
				</>
			) : (
				<div
					className='w-full h-full justify-center items-center flex cursor-pointer animate-pulse'
					onClick={() => setIsOpened(true)}>
					Get started
				</div>
			)}
		</div>
	);
};

export default App;

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:9002');
const Log = (props: {slug:string}) => {
	const [messages, setMessages] = useState<string[]>(['Your logs will appear here']);
	const slug = props.slug;
	useEffect(() => {
			
			socket.emit('subscribe', `logs:${slug}`);

			socket.on('message', (message) => {
				setMessages((prevMessages) => [...prevMessages, message]);
			});

			// Cleanup on component unmount
			return () => {
				socket.off('message');
			};
		}, [slug]);
	return (
		<div className=" rounded text-white">
			<div className="bg-slate-500">Log</div>

			<div className="bg-slate-600 flex justify-center overflow-auto">
				<div>
					<div className="h-96 w-96 ">
						{messages.map((message, index) => (
							<p key={index}>{message}</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Log;

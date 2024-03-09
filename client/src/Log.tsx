import { useState } from 'react';

const Log = () => {
	const [logs, setLogs] = useState<string[]>(['Your logs will appear here']);
	return (
		<div className=" rounded text-white">
			<div className="bg-slate-500">Log</div>

			<div className="bg-slate-600 flex justify-center">
				<div>
					<div className="h-96 w-96">
						{logs.map((log, index) => (
							<p key={index}>{log}</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Log;

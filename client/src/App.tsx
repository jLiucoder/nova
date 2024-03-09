import { FormEvent, useState } from 'react';
import './App.css';
import Log from './Log';

interface FormData {
	gitURL: string;
	distFolder: string;
}

const outputOptions: string[] = ['dist', 'build', 'public', 'out'];

function App() {
	const [formData, setFormData] = useState<FormData>({
		gitURL: '',
		distFolder: '',
	});
	const [data, setData] = useState({});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!outputOptions.includes(formData.distFolder)) {
			alert('Invalid output folder');
			return;
		}
		try {
			const response = await fetch('http://localhost:9000/project', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				// Request was successful
				const data = await response.json();
				// Process the data here
				setData(data.data);
				console.log(data.data);
			} else {
				// Request failed
				throw new Error('Request failed');
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="font-serif">
			<h1 className="text-6xl pb-5">Nova</h1>
			<h1 className="text-xl pb-5">Publish your static sites in seconds</h1>
			<div className="flex items-center justify-center">
				<div>
					{data ? <div>{data.url}</div> : <br />}
					<form onSubmit={handleSubmit} className="text-center">
						<div className="pb-5">
							<label htmlFor="gitURL">URL:</label>
							<input
								className="border-2 border-gray-300 rounded-md p-2 w-96"
								type="text"
								id="gitURL"
								name="gitURL"
								value={formData.gitURL}
								onChange={handleInputChange}
								placeholder="https://github.com/user/repo"
								required
								autoComplete="off"
							/>
						</div>

						<div className="pb-5">
							<label htmlFor="distFolder">Output:</label>
							<input
								className="border-2 border-gray-300 rounded-md p-2 w-96"
								type="text"
								id="distFolder"
								name="distFolder"
								value={formData.distFolder}
								onChange={handleInputChange}
								placeholder="dist / build / out / public"
								required
								autoComplete="off"
							/>
						</div>
						<div className="pb-5">
							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							>
								Submit
							</button>
						</div>
					</form>
				</div>

				<div className=" pl-10 w-1/2 ">
					<Log />
				</div>
			</div>
		</div>
	);
}

export default App;

/* eslint-disable no-lonely-if */
const axios = require('axios');
require('dotenv').config()

async function streamCompletion(prompt, onData) {
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
	};

	const data = {
		model: 'text-davinci-003',
		prompt,
		temperature: 1,
		max_tokens: 1500,
		stream: true,
	};

	const res = await axios.post('https://api.openai.com/v1/completions', data, {
		headers: headers,
		responseType: 'stream',
	});

	// Remainder chunk - When json is incomplete
	let remainderChunk = '';

	let output = '';

	const processedChunks = new Promise((resolve, reject) => {
		res.data.on('data', (chunk) => {
			const chunkStr = chunk.toString();
			console.log(chunkStr);
			if(chunkStr.trim() !== '[DONE]') {
				// split data using data: as one chunk can contain multiple and also filter this those that starts with { or }
				const item = chunkStr.split('data: ')
					.map(i => i.trim())
					.filter(i => (i.startsWith('{') || i.endsWith('}')));

				item.forEach(i => {
					// Filter out proper and complete data
					if(i.startsWith('{') && i.endsWith('}')) {
						const parsedChunk = JSON.parse(i);
						output += parsedChunk.choices[0].text;
						onData(parsedChunk.choices[0].text);
					}
					else {
						// If its incomplete and starts with { then add remained that it needs to be added in next set
						if(i.startsWith('{')) {
							remainderChunk += i;
						}
						else {
							// complete the current chunk with remained and mark remainder as an empty one
							const finalChunk = remainderChunk + i;
							remainderChunk = '';
							const parsedFinalChunk = JSON.parse(finalChunk);
							output += parsedFinalChunk.choices[0].text;
							onData(parsedFinalChunk.choices[0].text);
						}
					}
				});
			}
		});

		res.data.on('end', () => {
			resolve(output);
		});

		res.data.on('error', (err) => {
			reject(err);
		});
	});

	return processedChunks;
}

module.exports = streamCompletion;
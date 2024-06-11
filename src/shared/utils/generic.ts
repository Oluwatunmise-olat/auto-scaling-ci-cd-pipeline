export const capitalize = (text: string) => {
	text = text.toLowerCase()

	const splittedString = text.split(' ')

	let capitalizedText = ''

	for (let index = 0; index < splittedString.length; index++) {
		const word = splittedString[index]
		capitalizedText += `${word.charAt(0).toUpperCase()}${word.slice(1)} `
	}

	return capitalizedText.trim()
}

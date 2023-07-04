export function camelCaseToCapitalized(text: string): string {
  // Split the string at each capital letter or underscore
  const words = text.split(/(?=[A-Z])|_/)

  // Capitalize the first letter of each word and join them back
  const capitalizedText = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return capitalizedText
}

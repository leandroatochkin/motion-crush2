 export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

 export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

 export const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s'-]{2,80}$/

 export const phoneRegex = /^(\d{1,3})(\d{8,10})$/;

 export const onlyNumbersRegex = /^\d{2,50}$/
 
 export const addressRegex = /^[\p{L}\d\s.,°º#\-]{5,}$/u

 export const propertyNameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s'-]{2,80}$/

 export const observationsRegex = /^[\p{L}\d\s.,°º#\-]{2,}$/u

 export const cuitRegex = /^\d{11}$/

 export const idRegex = /^\d{1,11}$/

 export const spamRegex = new RegExp(
  [
    "(https?:\\/\\/|www\\.)",                           // URLs
    "([a-zA-Z0-9])\\1{4,}",                             // Character spam
    "(buy now|free money|casino|xxx|sex|crypto|investment|followers|telegram)", // Phrases
    "[^\\w\\s.,!¡?¿:\\/\\-]{6,}",                       // Symbol spam
    "[\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u206F]",  // Zero-width & bidi control
    "[\\u0400-\\u04FF]{3,}",                            // Cyrillic spam bursts
    "[\\u2100-\\u214F]",                                // Letterlike symbols
    "[\\u2200-\\u22FF]"                                 // Math symbols
  ].join("|"),
  "i"
);
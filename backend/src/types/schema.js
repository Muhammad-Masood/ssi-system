// FHIR Templates

// Patient Resource //
/**
 * @typedef {Object} Patient
 * @property {"Patient"} resourceType
 * @property {string} identifier - An identifier for this patient
 * @property {boolean} [active] - Whether this patient's record is in active use
 * @property {Array<HumanName>} [name] - A name associated with the patient
 * @property {Array<ContactPoint>} [telecom] - A contact detail for the individual
 * @property {"male" | "female" | "other" | "unknown"} [gender]
 * @property {string} [birthDate] - The date of birth for the individual (YYYY-MM-DD)
 * @property {boolean} [deceasedBoolean]
 * @property {string} [deceasedDateTime] - DateTime format
 * @property {Array<Address>} [address] - An address for the individual
 * @property {CodeableConcept} [maritalStatus] - Marital (civil) status of a patient
 * @property {boolean} [multipleBirthBoolean]
 * @property {number} [multipleBirthInteger]
 * @property {Array<Attachment>} [photo] - Image of the patient
 * @property {Array<{
 *   relationship?: Array<CodeableConcept>,
 *   name?: HumanName,
 *   telecom?: Array<ContactPoint>,
 *   address?: Address,
 *   gender?: "male" | "female" | "other" | "unknown",
 *   organization?: Reference<"Organization">,
 *   period?: Period
 * }>} [contact]
 * @property {Array<{
 *   language: CodeableConcept,
 *   preferred?: boolean
 * }>} [communication]
 * @property {Array<Reference<"Organization" | "Practitioner" | "PractitionerRole">>} [generalPractitioner] - Primary care provider
 * @property {Reference<"Organization">} [managingOrganization] - Organization managing the patient record
 * @property {Array<{
 *   other: Reference<"Patient" | "RelatedPerson">,
 *   type: "replaced-by" | "replaces" | "refer" | "seealso"
 * }>} [link]
 */

export {};

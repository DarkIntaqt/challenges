/**
 * 
 * @typedef StatsDto
 * @type {Object}
 * @property {number} CHALLENGER 
 * @property {number} BRONZE
 * @property {number} GOLD
 * @property {number} MASTER 
 * @property {number} GRANDMASTER 
 * @property {number} SILVER 
 * @property {number} DIAMOND
 * @property {number} PLATINUM
 * @property {number} IRON
*/

/**
 * @typedef GlobalChallengeDto
 * @type {Object}
 * @property {string} icon
 * @property {number} icon_2
 * @property {number} timestamp
 * @property {Array.<string>} title 
 * @property {ChallengeDto} challenge 
 * @property {Object} stats 
 * @property {Object} summoner
 */

/**
 * @typedef ChallengeDto
 * @type {Object}
 * @property {number} id
 * @property {string} state
 * @property {string} name
 * @property {string} description
 * @property {string} descriptionShort
 * @property {string} source
 * @property {Array.<number>} queueIds
 * @property {number} parent
 * @property {boolean} capstone
 * @property {boolean} reversed
 * @property {Array.<StatsDto>} thresholds
 * @property {Array.<StatsDto>} percentiles
 */

/**
 * @typedef ChallengesRawDto
 * @type {Object}
 * @property {Array.<ChallengeDto>} challenges
 * @property {Array.<TitleDto>} titles
 */

/**
 * @typedef TitleDto
 * @type {Object}
 * @property {string} title
 * @property {number} titleId
 * @property {number} challengeId
 * @property {number} challengeTier
 */
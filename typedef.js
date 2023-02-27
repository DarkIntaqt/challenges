  /**
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
   * @typedef TranslationDto
   * @type {Object}
   * @property {string} description
   * @property {string} name 
   * @property {string} shortDescription
   */

  /**
   * @typedef TagsDto
   * @type {Object} 
   * @property {string} isCapstone 
   * @property {string} source
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
   * @property {boolean} leaderboard 
   * @property {Array.<string>} thresholds
   * @property {TranslationDto} translation
   * @property {boolean} reversed
   * @property {Array.<number>} queueIds 
   * @property {TagsDto} tags 
   * @property {string} parent 
   * @property {string} parentCategory 
   * @property {Array.<StatsDto>} percentiles
   * @property {Array.<number>} leaderboardThresholds
   */

  /**
   * @typedef TitleDto
   * @type {Object}
   * @property {string} type
   * @property {string} title
   * @property {number} percentile
   * @property {number} icon 
   * @property {string} challenge 
   * @property {string} description 
   * @property {number} threshold 
   * @property {string} cid
   */
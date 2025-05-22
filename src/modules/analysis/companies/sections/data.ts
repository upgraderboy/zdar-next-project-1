export interface Job {
    id: string
    title: string
    description: string
    jobType: string
    experienceLevel: string
    softSkills?: string[]
    hardSkills?: string[]
    salaryRange?: string
    genderPreference?: string
    ageCategory?: string[]
    isDisabilityAllowed?: boolean
    isPublished?: boolean
    companyId: string
    companyName: string
    lat?: number
    lng?: number
    stateName?: string
    countryName?: string
    createdAt: Date
    updatedAt: Date
  }
  
  // Generate random job data
  export function generateDummyData(count: number): Job[] {
    const jobTypes = ["Full-Time", "Part-Time", "Internship", "Remote"]
    const experienceLevels = ["Junior", "Mid-Level", "Senior", "Lead", "Executive"]
    const salaryRanges = ["₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20-30 LPA", "₹30+ LPA", undefined]
    const softSkills = [
      "Communication",
      "Teamwork",
      "Problem Solving",
      "Time Management",
      "Leadership",
      "Adaptability",
      "Creativity",
      "Critical Thinking",
      "Emotional Intelligence",
      "Conflict Resolution",
    ]
    const hardSkills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "SQL",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "HTML/CSS",
      "GraphQL",
      "REST API",
      "MongoDB",
      "PostgreSQL",
      "Redux",
      "Next.js",
      "TailwindCSS",
    ]
    const companies = [
      "TechCorp",
      "InnovateSoft",
      "DataDynamics",
      "CloudNine",
      "CodeCrafters",
      "ByteBuilders",
      "QuantumQueries",
      "PixelPerfect",
      "ServerStack",
      "DevDynamo",
    ]
    const states = [
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
      "Telangana",
      "Uttar Pradesh",
      "Gujarat",
      "West Bengal",
      "Haryana",
      "Punjab",
    ]
    const countries = ["India", "USA", "UK", "Canada", "Australia", "Singapore", "Germany"]
    const jobTitles = [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "DevOps Engineer",
      "Data Scientist",
      "UI/UX Designer",
      "Product Manager",
      "QA Engineer",
      "Machine Learning Engineer",
      "Mobile App Developer",
      "Cloud Architect",
      "Database Administrator",
      "Systems Analyst",
      "Network Engineer",
      "Security Specialist",
      "Technical Writer",
      "Business Analyst",
      "Scrum Master",
      "IT Support Specialist",
      "Blockchain Developer",
    ]
    const ageCategories = ["up to 20", "21-30", "31-40", "41-50", "51+"]
    const genderPreferences = ["All", "Male", "Female", "Other"]
  
    return Array.from({ length: count }, (_, i) => {
      const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)]
      const randomExperienceLevel = experienceLevels[Math.floor(Math.random() * experienceLevels.length)]
      const randomSalaryRange = salaryRanges[Math.floor(Math.random() * salaryRanges.length)]
      const randomCompany = companies[Math.floor(Math.random() * companies.length)]
      const randomState = states[Math.floor(Math.random() * states.length)]
      const randomCountry = countries[Math.floor(Math.random() * countries.length)]
      const randomJobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
      const randomGenderPreference = genderPreferences[Math.floor(Math.random() * genderPreferences.length)]
  
      // Generate random skills
      const randomSoftSkillsCount = Math.floor(Math.random() * 5) + 1
      const randomSoftSkillsSet = new Set<string>()
      for (let j = 0; j < randomSoftSkillsCount; j++) {
        randomSoftSkillsSet.add(softSkills[Math.floor(Math.random() * softSkills.length)])
      }
  
      const randomHardSkillsCount = Math.floor(Math.random() * 8) + 2
      const randomHardSkillsSet = new Set<string>()
      for (let j = 0; j < randomHardSkillsCount; j++) {
        randomHardSkillsSet.add(hardSkills[Math.floor(Math.random() * hardSkills.length)])
      }
  
      // Generate random age categories (1-3 categories)
      const randomAgeCategoryCount = Math.floor(Math.random() * 3) + 1
      const randomAgeCategoriesSet = new Set<string>()
      for (let j = 0; j < randomAgeCategoryCount; j++) {
        randomAgeCategoriesSet.add(ageCategories[Math.floor(Math.random() * ageCategories.length)])
      }
  
      // Generate random creation date (within the last 30 days)
      const creationDate = new Date()
      creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 30))
  
      return {
        id: `job-${i}`,
        title: randomJobTitle,
        description: `This is a ${randomJobType} position for a ${randomJobTitle} at ${randomCompany}.`,
        jobType: randomJobType,
        experienceLevel: randomExperienceLevel,
        softSkills: Array.from(randomSoftSkillsSet),
        hardSkills: Array.from(randomHardSkillsSet),
        salaryRange: randomSalaryRange,
        genderPreference: randomGenderPreference,
        ageCategory: Array.from(randomAgeCategoriesSet),
        isDisabilityAllowed: Math.random() > 0.7,
        isPublished: true,
        companyId: `company-${Math.floor(Math.random() * 10)}`,
        companyName: randomCompany,
        lat: 18.52 + Math.random() * 10,
        lng: 73.85 + Math.random() * 10,
        stateName: randomState,
        countryName: randomCountry,
        createdAt: creationDate,
        updatedAt: new Date(),
      }
    })
  }
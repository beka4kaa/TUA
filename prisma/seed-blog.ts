/**
 * Seed script for Blog posts
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-blog.ts
 * Or: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding blog posts...\n");
  
  // Find or create admin user
  let admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  
  if (!admin) {
    console.log("Creating admin user...");
    admin = await prisma.user.create({
      data: {
        email: "admin@ymitacademy.com",
        name: "Admin",
        role: "ADMIN",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.", // Change this!
      },
    });
  }
  
  console.log(`Using admin: ${admin.email}\n`);
  
  // Create tags
  const tagNames = [
    "University Admissions",
    "Essay Writing",
    "Scholarships",
    "Study in USA",
    "Study in UK",
    "IELTS",
    "SAT",
    "Tips & Guides",
    "Success Stories",
    "Career Advice",
  ];
  
  const tags: Record<string, string> = {};
  
  for (const name of tagNames) {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    
    tags[name] = tag.id;
    console.log(`  ✓ Tag: ${name}`);
  }
  
  console.log("");
  
  // Sample blog posts
  const posts = [
    {
      title: "How to Write a Compelling Personal Statement",
      slug: "how-to-write-compelling-personal-statement",
      excerpt: "Your personal statement is your chance to stand out from thousands of applicants. Learn the secrets of crafting a narrative that admissions officers can't forget.",
      content: `# How to Write a Compelling Personal Statement

Your personal statement is arguably the most important piece of your university application. It's your opportunity to speak directly to admissions officers and show them who you are beyond your grades and test scores.

## Why Your Personal Statement Matters

Universities receive thousands of applications from qualified candidates. Your personal statement helps differentiate you and gives context to your achievements.

### Key Elements of a Strong Personal Statement

1. **A compelling hook** - Start with something that grabs attention
2. **Personal narrative** - Share your unique story and experiences
3. **Growth and reflection** - Show how you've developed as a person
4. **Clear goals** - Explain what you want to achieve and why

## Common Mistakes to Avoid

- **Being too generic** - Avoid clichés and vague statements
- **Listing achievements** - Focus on impact, not just accomplishments
- **Poor structure** - Organize your thoughts clearly
- **Not answering the prompt** - Stay on topic

## The Writing Process

### Step 1: Brainstorm
Take time to reflect on your experiences, challenges, and achievements. What makes you unique?

### Step 2: Outline
Create a structure before you start writing. This helps maintain focus and flow.

### Step 3: Write the First Draft
Don't aim for perfection. Get your ideas down first.

### Step 4: Revise and Edit
Take breaks between editing sessions. Read aloud to catch awkward phrasing.

### Step 5: Get Feedback
Have teachers, counselors, or mentors review your essay.

## Final Tips

- Be authentic - admissions officers can spot fake enthusiasm
- Show, don't tell - use specific examples
- Stay within the word limit
- Proofread multiple times

Remember, your personal statement should reflect your voice and personality. Take your time, be thoughtful, and let your true self shine through.`,
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-15"),
      readingTimeMinutes: 5,
      tags: ["Essay Writing", "Tips & Guides", "University Admissions"],
    },
    {
      title: "Top 10 Scholarships for International Students in 2024",
      slug: "top-10-scholarships-international-students-2024",
      excerpt: "Funding your education abroad doesn't have to break the bank. Discover the most prestigious scholarships available for international students this year.",
      content: `# Top 10 Scholarships for International Students in 2024

Studying abroad can be expensive, but numerous scholarships exist specifically for international students. Here's our curated list of the most valuable opportunities.

## Full Scholarships

### 1. Fulbright Program (USA)
The premier international exchange program offers full funding for graduate studies in the United States.

**Coverage:** Tuition, living expenses, travel, health insurance
**Deadline:** Varies by country (typically October)

### 2. Chevening Scholarships (UK)
The UK government's global scholarship program for future leaders.

**Coverage:** Tuition, living allowance, flights
**Requirements:** 2+ years work experience

### 3. DAAD Scholarships (Germany)
Germany's largest funding organization for international academic exchange.

**Coverage:** Monthly stipend, travel allowance, health insurance
**Programs:** Various levels of study

## Partial Scholarships

### 4. Erasmus Mundus (Europe)
Joint master's degrees offered by multiple European universities.

### 5. Commonwealth Scholarships
For students from Commonwealth countries to study in the UK.

### 6. Australia Awards
Australian government scholarships for developing countries.

## University-Specific Scholarships

### 7. Stanford Knight-Hennessy Scholars
Full funding for graduate study at Stanford University.

### 8. Rhodes Scholarship
Study at Oxford University with full financial support.

### 9. Gates Cambridge Scholarship
Full-cost award for postgraduate study at Cambridge.

### 10. ETH Excellence Scholarship
For master's students at ETH Zurich, Switzerland.

## How to Increase Your Chances

1. **Start early** - Most deadlines are 9-12 months before study
2. **Research thoroughly** - Understand each scholarship's values
3. **Tailor applications** - Customize essays for each scholarship
4. **Get strong references** - Build relationships with recommenders
5. **Show leadership** - Demonstrate impact in your community

## Conclusion

These scholarships are competitive but achievable. Start your research early, prepare strong applications, and don't be afraid to apply to multiple programs.`,
      status: "PUBLISHED",
      publishedAt: new Date("2024-02-01"),
      readingTimeMinutes: 7,
      tags: ["Scholarships", "Study in USA", "Study in UK"],
    },
    {
      title: "IELTS vs TOEFL: Which English Test Should You Take?",
      slug: "ielts-vs-toefl-which-test-should-you-take",
      excerpt: "Confused about which English proficiency test to take? We break down the key differences between IELTS and TOEFL to help you make the right choice.",
      content: `# IELTS vs TOEFL: Which English Test Should You Take?

If you're planning to study abroad, you'll likely need to prove your English proficiency. The two most widely accepted tests are IELTS and TOEFL. Let's compare them.

## Overview

| Feature | IELTS | TOEFL iBT |
|---------|-------|-----------|
| Duration | 2 hours 45 mins | 2 hours |
| Format | Paper or Computer | Computer only |
| Speaking | Face-to-face | Recorded |
| Scoring | 0-9 bands | 0-120 points |

## Test Format

### IELTS (International English Language Testing System)

**Listening:** 30 minutes, 40 questions
- 4 sections with increasing difficulty
- Various accents (British, Australian, American)

**Reading:** 60 minutes, 40 questions
- Academic: 3 long passages
- General: Shorter, practical texts

**Writing:** 60 minutes, 2 tasks
- Task 1: Graph/chart description (150 words)
- Task 2: Essay (250 words)

**Speaking:** 11-14 minutes
- Face-to-face with an examiner
- 3 parts: introduction, long turn, discussion

### TOEFL iBT

**Reading:** 35 minutes, 20 questions
- 2 passages from academic texts

**Listening:** 36 minutes, 28 questions
- Lectures and conversations

**Speaking:** 16 minutes, 4 tasks
- Recorded responses to prompts

**Writing:** 29 minutes, 2 tasks
- Integrated and independent essays

## Which Should You Choose?

### Choose IELTS if:
- You prefer speaking face-to-face
- You're applying to UK, Australian, or European universities
- You want variety in accents
- You prefer handwritten or computer-based options

### Choose TOEFL if:
- You're comfortable with computer-based tests
- You're applying primarily to US universities
- You prefer typed responses
- You don't like speaking to strangers in person

## Score Comparison

| IELTS | TOEFL iBT |
|-------|-----------|
| 9.0 | 118-120 |
| 8.5 | 115-117 |
| 8.0 | 110-114 |
| 7.5 | 102-109 |
| 7.0 | 94-101 |
| 6.5 | 79-93 |
| 6.0 | 60-78 |

## Preparation Tips

1. Take practice tests to understand the format
2. Focus on your weakest sections
3. Time yourself during practice
4. Read academic articles regularly
5. Listen to English podcasts
6. Practice speaking English daily

## Conclusion

Both tests are widely accepted. Choose based on your preferences and target universities. Check specific requirements before registering.`,
      status: "PUBLISHED",
      publishedAt: new Date("2024-02-15"),
      readingTimeMinutes: 6,
      tags: ["IELTS", "Tips & Guides", "University Admissions"],
    },
    {
      title: "From Almaty to Harvard: Aizhan's Journey",
      slug: "from-almaty-to-harvard-aizhans-journey",
      excerpt: "Read how Aizhan overcame challenges and achieved her dream of studying at Harvard University with guidance from Ymit Academy.",
      content: `# From Almaty to Harvard: Aizhan's Journey

*This is the story of Aizhan Nurzhanova, who became the first student from her school in Almaty to be accepted to Harvard University.*

## The Dream Begins

"I remember watching Harvard videos on YouTube when I was 14," Aizhan recalls. "It seemed impossible for someone like me—from a regular Kazakh family—to even think about studying there."

But dreams have a way of persisting.

## Early Challenges

Growing up in Almaty, Aizhan faced several obstacles:

- **Limited resources** - No access to expensive test prep courses
- **Lack of guidance** - No one in her family had studied abroad
- **Self-doubt** - Everyone said it was "unrealistic"

## The Turning Point

In her second year of high school, Aizhan discovered Ymit Academy.

> "Finally, someone believed my dream was possible. They didn't just help me prepare—they showed me it was achievable."

## The Preparation Journey

### Academic Excellence
Aizhan maintained a 5.0 GPA while participating in multiple olympiads.

### Standardized Tests
- SAT: 1550 (after three attempts)
- IELTS: 8.5

### Extracurriculars
- Founded an environmental club at school
- Organized city-wide recycling campaigns
- Started a tutoring program for underprivileged students

### The Application
With Ymit Academy's guidance, Aizhan crafted essays that truly represented her story:

- Her experience growing up between two cultures
- Her passion for environmental justice
- Her vision for creating change in Central Asia

## The Decision Day

On March 28, 2023, Aizhan opened her decision letter.

**"Congratulations! It is my pleasure to inform you that the Committee on Admissions has admitted you to the Harvard Class of 2027."**

## Life at Harvard

Now studying Environmental Science and Public Policy, Aizhan is thriving:

- Member of the Harvard Central Asian Society
- Research assistant in the Environmental Law Clinic
- Mentoring other Kazakh students applying to US universities

## Aizhan's Advice

1. **Dream big, but work harder** - "Talent means nothing without effort"
2. **Find your community** - "You can't do it alone"
3. **Stay authentic** - "Harvard didn't want a perfect student—they wanted me"
4. **Start early** - "The preparation takes years, not months"

## Conclusion

Aizhan's journey proves that with the right support, dedication, and belief in yourself, the impossible becomes possible.

*Are you ready to write your own success story? [Contact Ymit Academy today.](/contact)*`,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-01"),
      readingTimeMinutes: 5,
      tags: ["Success Stories", "Study in USA", "University Admissions"],
    },
    {
      title: "SAT Preparation: A Complete 3-Month Study Plan",
      slug: "sat-preparation-3-month-study-plan",
      excerpt: "A structured, week-by-week study plan to maximize your SAT score in just 3 months. Includes resources, practice strategies, and expert tips.",
      content: `# SAT Preparation: A Complete 3-Month Study Plan

The SAT can feel overwhelming, but with a structured approach, you can achieve significant score improvements in just 12 weeks.

## Before You Start

### Take a Diagnostic Test
- Use an official College Board practice test
- Time yourself strictly
- Score it honestly

### Set Your Goals
- Research score requirements for your target schools
- Calculate needed improvement
- Set realistic weekly targets

## Month 1: Foundation Building

### Week 1-2: Reading Section

**Focus Areas:**
- Understanding passage types (literature, history, science, social science)
- Identifying main ideas and evidence
- Vocabulary in context

**Daily Tasks:**
- Read 2 passages (20 minutes)
- Answer questions, then review wrong answers
- Keep a vocabulary journal

### Week 3-4: Writing Section

**Focus Areas:**
- Grammar rules (subject-verb agreement, punctuation, etc.)
- Sentence structure
- Transition words

**Daily Tasks:**
- Study one grammar concept per day
- Complete 10-15 practice questions
- Review explanation for wrong answers

## Month 2: Skill Development

### Week 5-6: Math No-Calculator

**Key Topics:**
- Linear equations
- Systems of equations
- Absolute value
- Ratios and proportions

**Practice Strategy:**
- Master mental math
- Learn common patterns
- Time yourself

### Week 7-8: Math Calculator

**Key Topics:**
- Data analysis
- Problem-solving
- Advanced algebra
- Trigonometry basics

**Practice Strategy:**
- Know when to use calculator
- Don't over-rely on technology
- Check your work

## Month 3: Test Strategy & Practice

### Week 9-10: Full Practice Tests

**Schedule:**
- Take 2 full practice tests per week
- Always simulate real conditions
- Review thoroughly the next day

**Analysis:**
- Identify patterns in mistakes
- Track timing per section
- Note which question types are hardest

### Week 11: Weakness Targeting

**Actions:**
- Focus exclusively on weak areas
- Do intensive drills
- Re-study missed concepts

### Week 12: Final Preparation

**Days 1-4:**
- Light review only
- One final practice test
- Focus on confidence building

**Days 5-7:**
- Rest and relax
- Prepare materials (ID, calculator, pencils)
- Good sleep schedule

## Essential Resources

### Free Resources
- Khan Academy (official SAT prep partner)
- College Board practice tests
- UWorld (limited free questions)

### Paid Resources
- Erica Meltzer books (Reading & Writing)
- College Panda (Math)
- 1600.io (video explanations)

## Test Day Tips

1. **The night before:** Pack everything, sleep early
2. **Morning of:** Eat a good breakfast, arrive early
3. **During the test:** Breathe, don't panic, skip and return
4. **Breaks:** Use the bathroom, have a snack, stretch

## Score Improvement Expectations

| Starting Score | 3-Month Target |
|----------------|----------------|
| 900-1000 | +150-200 |
| 1000-1100 | +100-150 |
| 1100-1200 | +80-120 |
| 1200-1300 | +50-100 |
| 1300+ | +30-70 |

## Final Words

Consistency beats intensity. A little progress every day compounds into significant improvement. Trust the process, stay committed, and you'll see results.`,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-15"),
      readingTimeMinutes: 8,
      tags: ["SAT", "Tips & Guides", "University Admissions"],
    },
  ];
  
  // Create posts
  for (const postData of posts) {
    const { tags: tagNames, ...data } = postData;
    
    // Check if post exists
    const existing = await prisma.post.findUnique({
      where: { slug: data.slug },
    });
    
    if (existing) {
      console.log(`  ⏭ Skipping (exists): ${data.title}`);
      continue;
    }
    
    // Create post
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: admin.id,
        tags: {
          create: tagNames.map((name) => ({
            tagId: tags[name],
          })),
        },
      },
    });
    
    console.log(`  ✓ Created: ${post.title}`);
  }
  
  console.log("\n✅ Blog seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

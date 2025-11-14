import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import Team from "./models/Team";
import Standup from "./models/Standup";

dotenv.config();

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI!);

    // Clear old database
    await User.deleteMany({});
    await Team.deleteMany({});
    await Standup.deleteMany({});

    // Create Users (hashed automatically)
    const rawUsers = [
      { name: "Rishav", email: "rishav@test.com", password: "Password123" },
      { name: "Aditi", email: "aditi@test.com", password: "Password123" },
      { name: "Kirat", email: "kirat@test.com", password: "Password123" },
      { name: "Rahul", email: "rahul@test.com", password: "Password123" },
      { name: "Khyati", email: "khyati@test.com", password: "Password123" },
    ];

    const users: any[] = [];
    for (let u of rawUsers) {
      const user = new User(u);
      await user.save(); 
      users.push(user);
    }

    // Create Teams
    const alpha = new Team({
      name: "Alpha",
      code: "ALPHA1",
      members: [users[0]._id, users[1]._id],
    });
    await alpha.save();

    const beta = new Team({
      name: "Beta",
      code: "BETA1",
      members: [users[2]._id, users[3]._id, users[4]._id],
    });
    await beta.save();

    // Assign teamId to each user
    users[0].teamId = alpha._id;
    users[1].teamId = alpha._id;

    users[2].teamId = beta._id;
    users[3].teamId = beta._id;
    users[4].teamId = beta._id;

    await Promise.all(users.map((u) => u.save()));

    
    const sampleTexts = [
      {
        yesterday: "Worked on UI components",
        today: "Integrate APIs",
        blockers: "Waiting for backend updates",
      },
      {
        yesterday: "Fixed auth bugs",
        today: "Write tests",
        blockers: "None",
      },
      {
        yesterday: "Team planning meeting",
        today: "Building layouts",
        blockers: "Need clarity from design",
      },
    ];

    for (const user of users) {
      const teamId = user.teamId;

      for (let i = 0; i < 3; i++) {
        const entry = sampleTexts[i % sampleTexts.length];
        const s = new Standup({
          userId: user._id,
          teamId: teamId,
          yesterday: entry.yesterday,
          today: entry.today,
          blockers: entry.blockers,
          date: new Date(Date.now() - i * 86400000),
          aiFeedback: {
            key_tasks: ["UI work", "Integration"],
            tone: "neutral",
            vague_score: 2,
            suggestion: "Be more specific in updates",
          },
        });
        await s.save();
      }
    }

    console.log("Standups created.");

    console.log("\nLogin Accounts:");
    users.forEach((u) =>
      console.log(`${u.email} | Password123`)
    );
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();

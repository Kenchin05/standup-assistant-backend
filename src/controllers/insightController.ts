
import Standup from "../models/Standup";
import Team from "../models/Team";

// Get insights for a user
export const getInsights = async (req:any, res:any) => {
  try {
    const userId = req.user.id;
    const standups = await Standup.find({ userId }).sort({ date: 1 });

    if (!standups.length)
      return res.json({ message: "No standups yet", totalStandups: 0 });

    const totalStandups = standups.length;
    const avgVagueness =
      standups.reduce((a, s) => a + (s.aiFeedback?.vague_score || 0), 0) /
      totalStandups;

    const toneDistribution = [
      { name: "Positive", value: standups.filter((s) => s.aiFeedback?.tone === "positive").length },
      { name: "Neutral", value: standups.filter((s) => s.aiFeedback?.tone === "neutral").length },
      { name: "Frustrated", value: standups.filter((s) => s.aiFeedback?.tone === "frustrated").length },
      { name: "Negative", value: standups.filter((s) => s.aiFeedback?.tone === "negative").length },
    ];
    // Calculate vagueness trend
    const vaguenessTrend = standups.map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      vague_score: s.aiFeedback?.vague_score || 0,
    }));

    // Dummy streak calc
    const streakDays = 5; // compute based on date continuity

    // Basic AI summary placeholder
    const aiSummary = `You’ve maintained a ${avgVagueness < 3 ? "clear" : "mixed"} communication pattern.
    Most of your standups reflect a ${toneDistribution[0].value > toneDistribution[2].value ? "positive" : "neutral"} tone.`;

    res.json({
      totalStandups,
      avgVagueness: avgVagueness.toFixed(1),
      positiveTonePercent: Math.round(
        (toneDistribution[0].value / totalStandups) * 100
      ),
      streakDays,
      toneDistribution,
      vaguenessTrend,
      aiSummary,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching insights", error: (err as Error).message});
  }
};

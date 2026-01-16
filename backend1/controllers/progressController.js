const Progress = require('../models/Progress');

const getProgress = async (req, res) => {
  try {
    const { learnerId, courseId } = req.params;
    
    let progress = await Progress.findOne({ learnerId, courseId });
    
    if (!progress) {
      progress = await Progress.create({
        learnerId,
        courseId,
        completedMaterials: [],
        lastAccessedMaterial: 0
      });
    }
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { learnerId, courseId, completedMaterials, lastAccessedMaterial } = req.body;
    
    let progress = await Progress.findOne({ learnerId, courseId });
    
    if (!progress) {
      progress = await Progress.create({
        learnerId,
        courseId,
        completedMaterials: completedMaterials || [],
        lastAccessedMaterial: lastAccessedMaterial || 0
      });
    } else {
      progress.completedMaterials = completedMaterials || progress.completedMaterials;
      progress.lastAccessedMaterial = lastAccessedMaterial !== undefined 
        ? lastAccessedMaterial 
        : progress.lastAccessedMaterial;
      await progress.save();
    }
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProgress, updateProgress };

import {
  Waves,
  Wind,
  Move,
  AlignCenter,
  Layers,
  Moon,
  Eye,
  Music2,
  Hand,
  Activity,
  Zap,
  Heart,
  RotateCcw,
  Fingerprint,
  Sun,
  type LucideIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DifficultyLevel = 'Beginner' | 'Intermediate'
export type IntensityLevel = 'very_low' | 'low' | 'moderate'
export type EnergyRequirement = 'minimal' | 'low' | 'moderate'

export type ExerciseCategory =
  | 'Grounding'
  | 'Breath Regulation'
  | 'Gentle Neck Release'
  | 'Shoulder Tension Relief'
  | 'Freeze-State Regulation'
  | 'Low-Energy Reset'
  | 'Sleep Preparation'
  | 'Seated Flare-Friendly'
  | 'Orienting'
  | 'Vagus Nerve Calming'
  | 'Micro-Movement'
  | 'Bilateral Regulation'
  | 'Body Scanning'
  | 'Somatic Release'
  | 'Postural Reset'
  | 'Sensory Awareness'

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'Grounding',
  'Breath Regulation',
  'Gentle Neck Release',
  'Shoulder Tension Relief',
  'Freeze-State Regulation',
  'Low-Energy Reset',
  'Sleep Preparation',
  'Seated Flare-Friendly',
  'Orienting',
  'Vagus Nerve Calming',
  'Micro-Movement',
  'Bilateral Regulation',
  'Body Scanning',
  'Somatic Release',
  'Postural Reset',
  'Sensory Awareness',
]

export interface ExercisePreviewContent {
  instructions: string[]
  benefits: string[]
}

export interface SomaticExercise {
  id: string
  name: string
  duration: string
  description: string
  icon: LucideIcon
  cue: string
  difficulty: DifficultyLevel
  category: ExerciseCategory
  purpose: string
  intensity: IntensityLevel
  energyRequirement: EnergyRequirement
  contraindications: string[]
  tensionFocusAreas: string[]
  pacingStyle: string
  fibromyalgiaSafetyNotes: string
  preview: ExercisePreviewContent
}

// ─── Exercise Library ─────────────────────────────────────────────────────────

export const EXERCISES: SomaticExercise[] = [

  // ── Grounding ───────────────────────────────────────────────────────────────

  {
    id: 'floor-contact-scan',
    name: 'Floor Contact Scan',
    duration: '5 min',
    description: 'Bring gentle awareness to the points where your body meets the surface beneath you',
    icon: Layers,
    cue: 'Feel where you are held.',
    difficulty: 'Beginner',
    category: 'Grounding',
    purpose: 'Re-establish a sense of safety through physical contact awareness',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['General body', 'Feet', 'Sitting bones'],
    pacingStyle: 'Extremely slow; no movement required',
    fibromyalgiaSafetyNotes: 'Fully passive — no physical exertion at any point. Safe during flares.',
    preview: {
      instructions: [
        'Sit or lie in a comfortable position. Do not adjust anything yet.',
        'Notice where your body is being held by the chair, floor, or bed.',
        'Start at your feet — feel the pressure, temperature, and texture of the surface.',
        'Slowly move your attention upward: ankles, calves, thighs, back, hands.',
        'Rest your attention wherever the contact feels most solid or supportive.',
      ],
      benefits: [
        'A growing sense of being held and supported',
        'Mild reduction in anxiety or floating feelings',
        'Increased body awareness without triggering pain',
      ],
    },
  },

  {
    id: 'gravity-release',
    name: 'Gravity Release',
    duration: '4 min',
    description: 'Allow the weight of your body to soften downward, surrendering to gravity gently',
    icon: Layers,
    cue: 'Let gravity hold you.',
    difficulty: 'Beginner',
    category: 'Grounding',
    purpose: 'Release physical bracing patterns by consciously yielding to gravity',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Shoulders', 'Jaw', 'Hands', 'Lower back'],
    pacingStyle: 'No movement; attention-based only',
    fibromyalgiaSafetyNotes: 'Zero exertion. Ideal for any symptom level.',
    preview: {
      instructions: [
        'Find a comfortable seated or reclining position.',
        'Take one natural breath and let your exhale soften your posture slightly.',
        'Imagine your muscles slowly releasing their grip — not forced, just noticed.',
        'Let your shoulders drop. Let your jaw loosen. Let your hands rest heavy.',
        'Stay for several minutes, simply allowing gravity to do the work.',
      ],
      benefits: [
        'Softening of chronic muscle bracing',
        'Sense of heaviness that signals relaxation',
        'Quieter mind through reduced holding effort',
      ],
    },
  },

  // ── Breath Regulation ────────────────────────────────────────────────────────

  {
    id: 'breath-regulation',
    name: 'Extended Exhale',
    duration: '6 min',
    description: 'Slow the breath to invite a restful state through a longer exhale',
    icon: Wind,
    cue: 'Notice your breathing without changing it forcefully.',
    difficulty: 'Beginner',
    category: 'Breath Regulation',
    purpose: 'Activate the parasympathetic nervous system through extended exhalation',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: ['Avoid breath-holding if you experience anxiety around breathing'],
    tensionFocusAreas: ['Chest', 'Diaphragm', 'Belly'],
    pacingStyle: 'Unhurried; no counting required unless it feels helpful',
    fibromyalgiaSafetyNotes: 'Never force the breath. If lightheadedness occurs, return to natural breathing.',
    preview: {
      instructions: [
        'Place one hand on your belly, one on your chest if you like.',
        'Notice your natural breath for a few cycles — no changes yet.',
        'Gradually allow your exhale to lengthen — just a little, without strain.',
        'Let the inhale follow naturally; do not control it.',
        'Stay curious, not perfect. Even one longer exhale is beneficial.',
      ],
      benefits: [
        'Helps settle the nervous system',
        'Supports a sense of inner steadiness',
        'Can soften overall body holding patterns',
      ],
    },
  },

  {
    id: 'gentle-box-breath',
    name: 'Gentle Box Breath',
    duration: '5 min',
    description: 'Equal-count breathing cycle practiced very slowly to restore rhythm',
    icon: Wind,
    cue: 'Let each phase be soft and equal.',
    difficulty: 'Beginner',
    category: 'Breath Regulation',
    purpose: 'Balance the breath cycle to calm the nervous system without straining',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: ['Skip breath-holding if anxious; breathe naturally instead'],
    tensionFocusAreas: ['Chest', 'Throat', 'Belly'],
    pacingStyle: 'Count of 3–4 per phase; slower is always better',
    fibromyalgiaSafetyNotes: 'Use a count of 3 only. Do not extend to higher counts. Stop if dizzy.',
    preview: {
      instructions: [
        'Sit comfortably with an upright but relaxed spine.',
        'Inhale slowly for a count of 3.',
        'Hold gently for a count of 3 — not a tense hold, just a pause.',
        'Exhale slowly for a count of 3.',
        'Pause gently at the bottom for a count of 3. Repeat 4–6 cycles.',
      ],
      benefits: [
        'A more regular, calmer breathing pattern',
        'Reduced feelings of overwhelm or urgency',
        'Greater sense of control over your internal state',
      ],
    },
  },

  // ── Gentle Neck Release ──────────────────────────────────────────────────────

  {
    id: 'neck-relaxation',
    name: 'Neck Relaxation',
    duration: '4 min',
    description: 'Gentle movement to release neck holding patterns without strain',
    icon: Move,
    cue: 'Allow your neck to lengthen, without straining.',
    difficulty: 'Beginner',
    category: 'Gentle Neck Release',
    purpose: 'Ease chronic tension patterns in the neck through minimal, mindful movement',
    intensity: 'low',
    energyRequirement: 'low',
    contraindications: ['Recent neck injury', 'Cervical instability — check with your care team first'],
    tensionFocusAreas: ['Neck', 'Upper trapezius', 'Base of skull'],
    pacingStyle: 'Extremely slow; stop at the first sign of pain',
    fibromyalgiaSafetyNotes: 'Move only to where there is ease — never into discomfort. One small movement is enough.',
    preview: {
      instructions: [
        'Begin with chin level and jaw soft.',
        'Slowly turn your head to one side — only as far as feels completely easy.',
        'Return to centre, pause, then turn to the other side.',
        'Finish with a small, slow nod if that feels comfortable.',
      ],
      benefits: [
        'Eases stiffness around the neck',
        'Supports clearer, softer posture',
        'Helps quiet mental chatter through gentle focus',
      ],
    },
  },

  {
    id: 'chin-float',
    name: 'Chin Float',
    duration: '3 min',
    description: 'Allow the chin to gently lower toward the chest to relieve base-of-skull tension',
    icon: Move,
    cue: 'Let your head be heavy, not held.',
    difficulty: 'Beginner',
    category: 'Gentle Neck Release',
    purpose: 'Decompress the upper cervical spine through gravity-assisted neck release',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Cervical disc issues', 'Recent concussion'],
    tensionFocusAreas: ['Base of skull', 'Upper neck', 'Jaw'],
    pacingStyle: 'One single slow movement held gently; no repetitions required',
    fibromyalgiaSafetyNotes: 'Never pull the head down. Let gravity do all the work. Maximum hold: 20 seconds.',
    preview: {
      instructions: [
        'Sit tall with your spine supported if possible.',
        'Take one breath. On the exhale, let your chin float slowly toward your chest.',
        'Feel the gentle stretch at the back of your neck.',
        'Hold for a few breaths — no strain, just noticing.',
        'Slowly lift back to neutral. Repeat once more if it felt comfortable.',
      ],
      benefits: [
        'Relief at the base of the skull',
        'Sense of length through the back of the neck',
        'Reduced headache tension',
      ],
    },
  },

  // ── Shoulder Tension Relief ──────────────────────────────────────────────────

  {
    id: 'shoulder-release',
    name: 'Shoulder Release',
    duration: '5 min',
    description: 'Soften tension around the shoulders and upper back through breath-led movement',
    icon: Waves,
    cue: 'Let your shoulders soften downward naturally.',
    difficulty: 'Beginner',
    category: 'Shoulder Tension Relief',
    purpose: 'Reduce upper-body holding by consciously releasing shoulder elevation',
    intensity: 'low',
    energyRequirement: 'low',
    contraindications: ['Avoid overhead movement', 'Shoulder impingement: omit the roll'],
    tensionFocusAreas: ['Shoulders', 'Upper trapezius', 'Upper back'],
    pacingStyle: 'One breath per movement; pause between each',
    fibromyalgiaSafetyNotes: 'Keep all movement within a pain-free range. Never force the roll.',
    preview: {
      instructions: [
        'Sit comfortably with feet grounded and spine tall.',
        'Inhale gently, then exhale and let shoulders drop away from your ears.',
        'Roll shoulders slowly backward once, then forward — without forcing.',
        'Pause and notice any warmth or ease in the upper back.',
      ],
      benefits: [
        'Helps reduce upper-body tension',
        'Encourages a calmer breathing rhythm',
        'Supports easier neck and arm movement',
      ],
    },
  },

  {
    id: 'shoulder-blade-melt',
    name: 'Shoulder Blade Melt',
    duration: '4 min',
    description: 'Invite the shoulder blades to slide gently down the back, releasing elevation holding',
    icon: Waves,
    cue: 'Let your shoulder blades become heavy.',
    difficulty: 'Beginner',
    category: 'Shoulder Tension Relief',
    purpose: 'Address chronic upper-trapezius tension through awareness and gravity',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Shoulder blades', 'Upper trapezius', 'Neck junction'],
    pacingStyle: 'Purely attention-based; no active movement needed',
    fibromyalgiaSafetyNotes: 'Can be done lying down. No effort required at any point.',
    preview: {
      instructions: [
        'Sit or lie comfortably. Let your arms rest at your sides.',
        'Notice where your shoulder blades are right now — likely raised.',
        'On an exhale, imagine them melting slowly downward and slightly apart.',
        'Do not push them down — just invite the release.',
        'Breathe here for several cycles, noticing any softening.',
      ],
      benefits: [
        'Reduced holding tension in the upper back',
        'Sense of space between the shoulder blades',
        'Calmer upper body overall',
      ],
    },
  },

  // ── Freeze-State Regulation ──────────────────────────────────────────────────

  {
    id: 'orientation-pause',
    name: 'Orientation Pause',
    duration: '4 min',
    description: 'Slowly scan the room with your eyes to signal safety to the nervous system',
    icon: Eye,
    cue: 'Let your eyes move slowly and freely.',
    difficulty: 'Beginner',
    category: 'Freeze-State Regulation',
    purpose: 'Interrupt a freeze or dissociative state by gently reorienting to the environment',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Eyes', 'Neck', 'Nervous system state'],
    pacingStyle: 'Very deliberate; one object at a time with full pauses',
    fibromyalgiaSafetyNotes: 'Appropriate even at very low energy. Safe during flares.',
    preview: {
      instructions: [
        'Sit or lie wherever you are. Do not change your position.',
        'Let your eyes move slowly around the room — not scanning quickly, but resting on objects.',
        'Notice one object: its shape, colour, texture. Stay there for a breath.',
        'Move to another object. Take your time.',
        'After 5 or 6 objects, notice how your body feels. Often slightly more settled.',
      ],
      benefits: [
        'Gentle return from freeze or numbness',
        'Increased sense of safety in the present moment',
        'Reduced heart rate and breath tension',
      ],
    },
  },

  {
    id: 'pendulation',
    name: 'Gentle Pendulation',
    duration: '5 min',
    description: 'Move awareness gently between areas of comfort and discomfort without forcing resolution',
    icon: RotateCcw,
    cue: 'You can always return to what is comfortable.',
    difficulty: 'Beginner',
    category: 'Freeze-State Regulation',
    purpose: 'Build tolerance for difficult sensation by rhythmically returning to resource states',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: ['If trauma is very recent, practice with a therapist first'],
    tensionFocusAreas: ['Whole body', 'Nervous system'],
    pacingStyle: 'Very gentle oscillation; never forced',
    fibromyalgiaSafetyNotes: 'Stop and rest in the comfortable area any time. There is no goal.',
    preview: {
      instructions: [
        'Find one area of your body that feels relatively comfortable right now.',
        'Rest your attention there for a few breaths.',
        'Now briefly notice an area that holds tension or discomfort — just a glance.',
        'Return immediately to the comfortable area. Breathe.',
        'Repeat this gentle "visiting" 3–4 times, always returning home.',
      ],
      benefits: [
        'Gradual expansion of tolerance for difficult sensations',
        'Reduction in freeze or shutdown responses',
        'Greater confidence in your ability to self-regulate',
      ],
    },
  },

  // ── Low-Energy Reset ─────────────────────────────────────────────────────────

  {
    id: 'reclined-body-breath',
    name: 'Reclined Body Breath',
    duration: '7 min',
    description: 'Lying-down breath awareness for days when upright movement is not possible',
    icon: Moon,
    cue: 'The breath will do all the work.',
    difficulty: 'Beginner',
    category: 'Low-Energy Reset',
    purpose: 'Offer nervous system support to the body when energy is very low',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body', 'Chest', 'Belly'],
    pacingStyle: 'Completely passive; observer only',
    fibromyalgiaSafetyNotes: 'Appropriate even during severe flares. No movement required at any point.',
    preview: {
      instructions: [
        'Lie down in a comfortable position. Use pillows under your knees if helpful.',
        'Close your eyes or soften your gaze.',
        'Notice that you are already breathing — you do not need to do anything.',
        'Simply observe where the breath moves in your body: belly, ribs, chest.',
        'Stay for as long as feels nourishing. Five minutes is enough.',
      ],
      benefits: [
        'Nervous system downregulation without any effort',
        'Gentle body awareness without triggering pain',
        'A sense of restoration even in difficult symptom days',
      ],
    },
  },

  {
    id: 'supported-still-rest',
    name: 'Supported Still Rest',
    duration: '10 min',
    description: 'Complete, held stillness — letting the surface carry all of your weight',
    icon: Moon,
    cue: 'You do not need to do anything right now.',
    difficulty: 'Beginner',
    category: 'Low-Energy Reset',
    purpose: 'Allow the nervous system to enter a deep rest state through total yielding',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body'],
    pacingStyle: 'No movement; sustained stillness',
    fibromyalgiaSafetyNotes: 'The only exercise where the goal is to do nothing at all. Always appropriate.',
    preview: {
      instructions: [
        'Find your most comfortable lying or seated position.',
        'Let your body settle completely. Use supports as needed.',
        'There is nothing to visualise or count. Just be here.',
        'If your mind wanders, gently notice that without judgment and return to rest.',
        'Set a gentle timer if that helps. Otherwise simply stay as long as needed.',
      ],
      benefits: [
        'Genuine physiological rest',
        'Reduced activation of the stress response',
        'Sense of permission to simply exist without producing',
      ],
    },
  },

  // ── Sleep Preparation ────────────────────────────────────────────────────────

  {
    id: 'descending-relaxation',
    name: 'Descending Relaxation',
    duration: '10 min',
    description: 'Progressive heaviness from head to feet to prepare the body for sleep',
    icon: Moon,
    cue: 'Let each part of your body become heavy and warm.',
    difficulty: 'Beginner',
    category: 'Sleep Preparation',
    purpose: 'Guide the body toward pre-sleep states through top-down progressive release',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body sequentially'],
    pacingStyle: 'Very slow, one body region per minute',
    fibromyalgiaSafetyNotes: 'Often better for fibromyalgia sleep onset than formal progressive muscle relaxation, which can trigger pain.',
    preview: {
      instructions: [
        'Lie down comfortably in your sleeping position.',
        'Begin at the top of your head. Notice any tension there and let it soften.',
        'Move slowly to your forehead, eyes, jaw — let each area feel heavy.',
        'Continue: neck, shoulders, arms, chest, belly, hips, legs, feet.',
        'Finish by feeling your whole body heavy and supported. Let sleep arrive.',
      ],
      benefits: [
        'Reduced time to sleep onset',
        'Lower night-time pain perception',
        'A gentle ritual that signals the body that safety is present',
      ],
    },
  },

  {
    id: 'night-breath-settle',
    name: 'Night Breath Settle',
    duration: '6 min',
    description: 'Listen to the sounds of your own breath as a bridge into sleep',
    icon: Moon,
    cue: 'Your breath is always with you.',
    difficulty: 'Beginner',
    category: 'Sleep Preparation',
    purpose: 'Use breath sound as an anchor to settle an overactive mind before sleep',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Mind', 'Chest', 'Throat'],
    pacingStyle: 'Passive listening only',
    fibromyalgiaSafetyNotes: 'Zero physical effort. Suitable for any symptom severity at night.',
    preview: {
      instructions: [
        'Lie in your sleeping position with eyes closed.',
        'Breathe naturally — make no effort to change the breath.',
        'Gently tune your attention to the sound of your own breathing.',
        'Listen as if you were listening to gentle rain — without engagement, just noticing.',
        'If thoughts arise, return to the sound. Each return is the practice.',
      ],
      benefits: [
        'Reduced nighttime mental chatter',
        'Easier transition from wakefulness to drowsiness',
        'A simple tool available every night without equipment',
      ],
    },
  },

  // ── Seated Flare-Friendly ────────────────────────────────────────────────────

  {
    id: 'spine-alignment-reset',
    name: 'Spine Alignment Reset',
    duration: '7 min',
    description: 'Gentle awareness from crown to tailbone while fully seated',
    icon: AlignCenter,
    cue: 'Imagine space between each vertebra, like pearls on a string.',
    difficulty: 'Intermediate',
    category: 'Seated Flare-Friendly',
    purpose: 'Restore postural awareness without demanding physical exertion',
    intensity: 'very_low',
    energyRequirement: 'low',
    contraindications: ['Severe lumbar pain — reduce movement to awareness only'],
    tensionFocusAreas: ['Spine', 'Lower back', 'Pelvis'],
    pacingStyle: 'One slow breath per region',
    fibromyalgiaSafetyNotes: 'Maintain soft active engagement rather than rigid holding. Rest if fatigued.',
    preview: {
      instructions: [
        'Stand or sit with weight evenly distributed.',
        'Lengthen through the crown of your head — lightly, not rigidly.',
        'Soften the lower ribs and let the pelvis feel neutral.',
        'Scan from head to hips, noticing areas that want more ease.',
        'Take three slow breaths before moving on.',
      ],
      benefits: [
        'Supports balanced, easeful posture',
        'Helps reduce back and hip tension',
        'Builds body awareness for daily movement',
      ],
    },
  },

  {
    id: 'chair-body-scan',
    name: 'Chair Body Scan',
    duration: '6 min',
    description: 'A complete awareness scan of the body while seated — no movement required',
    icon: AlignCenter,
    cue: 'Sit and simply notice.',
    difficulty: 'Beginner',
    category: 'Seated Flare-Friendly',
    purpose: 'Build body awareness and regulation while entirely supported in a chair',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body'],
    pacingStyle: 'One body zone per minute',
    fibromyalgiaSafetyNotes: 'No movement at any point. Fully appropriate during flares.',
    preview: {
      instructions: [
        'Sit in a supportive chair with both feet on the floor.',
        'Close your eyes if comfortable. Take one breath.',
        'Notice the top of your head — temperature, any tingling, any weight.',
        'Move your attention slowly down: face, throat, chest, arms, belly, legs, feet.',
        'You are not trying to change anything. Only to notice.',
      ],
      benefits: [
        'Improved interoceptive awareness',
        'Mild regulation of the nervous system',
        'Sense of connection with the body even on difficult days',
      ],
    },
  },

  // ── Orienting ────────────────────────────────────────────────────────────────

  {
    id: 'slow-room-gaze',
    name: 'Slow Room Gaze',
    duration: '5 min',
    description: 'Deliberately notice five objects in your environment to anchor the present moment',
    icon: Eye,
    cue: 'The room is safe. Let your eyes confirm that.',
    difficulty: 'Beginner',
    category: 'Orienting',
    purpose: 'Use environmental orienting to reduce hyperarousal and re-establish present-moment safety',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Eyes', 'Nervous system'],
    pacingStyle: 'Leisurely; no urgency',
    fibromyalgiaSafetyNotes: 'Fully passive. Can be done from any position, including bed.',
    preview: {
      instructions: [
        'Wherever you are, let your eyes move slowly around the space.',
        'Find one object. Notice its colour, shape, and texture. Pause there.',
        'Find a second object. Notice something you have not noticed before.',
        'Continue to 5 objects total. There is no rush.',
        'After the fifth, notice how your body feels. Often more settled.',
      ],
      benefits: [
        'Return to present-moment awareness',
        'Reduced activation from anxiety or hypervigilance',
        'Gentle nervous system regulation through the visual system',
      ],
    },
  },

  {
    id: 'peripheral-vision-soften',
    name: 'Peripheral Vision Soften',
    duration: '4 min',
    description: 'Widen your peripheral vision to shift the nervous system toward calm',
    icon: Eye,
    cue: 'Let your gaze become soft and wide.',
    difficulty: 'Beginner',
    category: 'Orienting',
    purpose: 'Activate the parasympathetic nervous system via a widened, unfocused visual field',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Eyes', 'Forehead', 'Nervous system state'],
    pacingStyle: 'Sustained soft gaze; no strain',
    fibromyalgiaSafetyNotes: 'Cannot cause harm. If eyes feel strained, close them and rest.',
    preview: {
      instructions: [
        'Focus on one point straight ahead of you — a spot on the wall.',
        'Without moving your eyes, begin to notice what is in the edges of your vision.',
        'Let your gaze soften — as if you are looking through the point rather than at it.',
        'Allow your awareness to expand in all directions simultaneously.',
        'Stay in this soft, wide gaze for two to three minutes.',
      ],
      benefits: [
        'Rapid shift in nervous system activation',
        'Reduced sense of threat or urgency',
        'Softening of forehead and eye tension',
      ],
    },
  },

  // ── Vagus Nerve Calming ──────────────────────────────────────────────────────

  {
    id: 'humming-breath',
    name: 'Humming Breath',
    duration: '5 min',
    description: 'A gentle hum on the exhale to stimulate the vagus nerve and calm the system',
    icon: Music2,
    cue: 'Let the sound be very soft — like a lullaby to yourself.',
    difficulty: 'Beginner',
    category: 'Vagus Nerve Calming',
    purpose: 'Stimulate the vagal pathway through gentle vocal vibration',
    intensity: 'very_low',
    energyRequirement: 'low',
    contraindications: ['Avoid if jaw pain is acute'],
    tensionFocusAreas: ['Throat', 'Chest', 'Jaw', 'Nervous system'],
    pacingStyle: 'One hum per exhale; rest between',
    fibromyalgiaSafetyNotes: 'Keep the hum very quiet. There should be no strain in the throat or jaw.',
    preview: {
      instructions: [
        'Sit comfortably. Take a gentle inhale through the nose.',
        'On the exhale, let a very soft "hmm" sound arise — as quiet as a whisper.',
        'Feel the gentle vibration in your chest, throat, and skull.',
        'Inhale naturally. Repeat.',
        'You may feel a slight warmth or settling in the chest after several rounds.',
      ],
      benefits: [
        'Direct stimulation of the vagus nerve',
        'Reduced heart rate variability tension',
        'Warmth and calm in the chest area',
      ],
    },
  },

  {
    id: 'throat-softening',
    name: 'Throat Softening',
    duration: '4 min',
    description: 'Consciously release tension around the throat, voice box, and upper chest',
    icon: Music2,
    cue: 'Your voice does not need to be held.',
    difficulty: 'Beginner',
    category: 'Vagus Nerve Calming',
    purpose: 'Release throat constriction that accompanies chronic stress and regulate vagal tone',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Throat', 'Neck', 'Jaw', 'Upper chest'],
    pacingStyle: 'Attention-based; one breath per area',
    fibromyalgiaSafetyNotes: 'No sound production needed. Awareness only is sufficient.',
    preview: {
      instructions: [
        'Sit comfortably. Gently swallow once to bring awareness to your throat.',
        'Notice any tightness or holding there — without judgment.',
        'On your next exhale, let the throat soften, as if releasing a held whisper.',
        'Let your jaw drop slightly. Let the roof of your mouth widen.',
        'Breathe here for several cycles, noticing any change.',
      ],
      benefits: [
        'Release of chronic throat constriction',
        'Easier, more open breathing',
        'Reduction in anxiety held in the upper body',
      ],
    },
  },

  // ── Micro-Movement ───────────────────────────────────────────────────────────

  {
    id: 'finger-ripple',
    name: 'Finger Ripple',
    duration: '4 min',
    description: 'Slow, sequential finger movement to restore gentle circulation and awareness',
    icon: Hand,
    cue: 'Let each finger move in its own time.',
    difficulty: 'Beginner',
    category: 'Micro-Movement',
    purpose: 'Introduce minimal purposeful movement without triggering fatigue or pain',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Acute hand or wrist pain'],
    tensionFocusAreas: ['Hands', 'Fingers', 'Forearms'],
    pacingStyle: 'One finger at a time; very slow',
    fibromyalgiaSafetyNotes: 'If any finger movement causes pain, skip that finger and only observe it.',
    preview: {
      instructions: [
        'Rest your hands on your lap or a flat surface, palms up.',
        'Starting with your little finger, slowly curl it in and uncurl it.',
        'Move to the next finger. Then the next. Take your time.',
        'Complete the ripple on both hands.',
        'Notice the sensation of movement — any warmth, tingling, or ease.',
      ],
      benefits: [
        'Gentle mobilisation of the small joints of the hand',
        'Restoration of hand body awareness',
        'Calming effect through focused micro-attention',
      ],
    },
  },

  {
    id: 'toe-awareness',
    name: 'Toe Spread and Release',
    duration: '4 min',
    description: 'Slowly spread and release the toes to activate grounding pathways',
    icon: Fingerprint,
    cue: 'Let your feet remember the ground.',
    difficulty: 'Beginner',
    category: 'Micro-Movement',
    purpose: 'Stimulate grounding through awareness of the feet and small toe movements',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Active foot or ankle injury'],
    tensionFocusAreas: ['Feet', 'Toes', 'Lower legs'],
    pacingStyle: 'Leisurely; no force',
    fibromyalgiaSafetyNotes: 'Can be done lying down. Spread only as far as is comfortable.',
    preview: {
      instructions: [
        'Sit with bare feet on the floor, or lying with legs extended.',
        'Bring your attention to your toes.',
        'Slowly try to spread all five toes of one foot apart.',
        'Hold for two breaths, then gently release.',
        'Repeat on the other foot. Notice any warmth or tingling.',
      ],
      benefits: [
        'Improved foot and lower-leg body awareness',
        'Mild grounding effect',
        'Gentle stimulation of the feet without walking',
      ],
    },
  },

  // ── Bilateral Regulation ─────────────────────────────────────────────────────

  {
    id: 'butterfly-hug',
    name: 'Butterfly Hug',
    duration: '5 min',
    description: 'Alternate gentle tapping on the chest to soothe the nervous system bilaterally',
    icon: Heart,
    cue: 'Hold yourself gently.',
    difficulty: 'Beginner',
    category: 'Bilateral Regulation',
    purpose: 'Use bilateral stimulation to reduce emotional dysregulation and anxiety',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Chest pain — use thighs instead of chest'],
    tensionFocusAreas: ['Nervous system', 'Emotional state', 'Chest'],
    pacingStyle: 'Slow alternating taps; one per second or slower',
    fibromyalgiaSafetyNotes: 'Use very light pressure. Tap only as lightly as touching a soap bubble.',
    preview: {
      instructions: [
        'Cross your arms over your chest, hands resting near your collarbones.',
        'Very gently tap alternately: left hand, right hand, left, right.',
        'Keep the tapping extremely light — a whisper of touch.',
        'Continue for 1–2 minutes while breathing softly.',
        'End by resting both hands on your chest for a moment.',
      ],
      benefits: [
        'Rapid soothing of acute emotional distress',
        'Sense of being held and contained',
        'Nervous system settling through bilateral input',
      ],
    },
  },

  {
    id: 'gentle-eye-sweep',
    name: 'Gentle Eye Sweep',
    duration: '4 min',
    description: 'Slow, deliberate horizontal eye movement to support bilateral nervous system regulation',
    icon: RotateCcw,
    cue: 'Let your eyes move slowly and without effort.',
    difficulty: 'Beginner',
    category: 'Bilateral Regulation',
    purpose: 'Engage bilateral processing to reduce freeze states and emotional congestion',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Vestibular sensitivity — keep movement very slow and stop if dizzy'],
    tensionFocusAreas: ['Eyes', 'Nervous system', 'Emotional state'],
    pacingStyle: 'Very slow side-to-side; one cycle every 4–5 seconds',
    fibromyalgiaSafetyNotes: 'Stop if any dizziness arises. Eyes only — do not move the head.',
    preview: {
      instructions: [
        'Sit comfortably and hold your head still.',
        'Hold a finger up at arm\'s length, level with your eyes.',
        'Move the finger very slowly from far left to far right — take 4 seconds.',
        'Follow with only your eyes, keeping your head still.',
        'Do 5 slow sweeps. Then rest with eyes closed for a breath.',
      ],
      benefits: [
        'Bilateral processing of tension and held emotion',
        'Reduction of freeze or shutdown activation',
        'Calmer mental state after a few minutes',
      ],
    },
  },

  // ── Body Scanning ────────────────────────────────────────────────────────────

  {
    id: 'head-to-toe-awareness',
    name: 'Head-to-Toe Awareness',
    duration: '8 min',
    description: 'A slow attention journey down the body to map sensation without judgement',
    icon: Activity,
    cue: 'There is nothing to fix — only to notice.',
    difficulty: 'Beginner',
    category: 'Body Scanning',
    purpose: 'Build interoceptive capacity and reduce body-based anxiety through non-judgemental observation',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body'],
    pacingStyle: 'One breath per region; unhurried',
    fibromyalgiaSafetyNotes: 'You do not need to notice pain specifically. If pain is present, acknowledge it and move on.',
    preview: {
      instructions: [
        'Lie or sit in a comfortable position. Close your eyes gently.',
        'Begin at the crown of your head. What do you notice there?',
        'Move slowly downward: face, jaw, neck, shoulders, chest, arms.',
        'Continue: belly, lower back, hips, thighs, knees, calves, feet.',
        'When you reach the feet, take a breath and notice the whole body at once.',
      ],
      benefits: [
        'Greater capacity to notice sensation before it becomes overwhelming',
        'Mild reduction in generalised anxiety',
        'Sense of embodied presence',
      ],
    },
  },

  {
    id: 'sensation-mapping',
    name: 'Sensation Mapping',
    duration: '6 min',
    description: 'Create a gentle mental map of where ease and tension currently live in your body',
    icon: Activity,
    cue: 'Ease and tension can exist at the same time.',
    difficulty: 'Beginner',
    category: 'Body Scanning',
    purpose: 'Improve differentiation between areas of comfort and discomfort to support regulation',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Whole body'],
    pacingStyle: 'Exploratory; no fixed sequence',
    fibromyalgiaSafetyNotes: 'If mapping pain feels distressing, return focus to a comfortable area. Safety first.',
    preview: {
      instructions: [
        'Close your eyes. Take a breath.',
        'Ask yourself: Where in my body is there ease right now? Even a small amount.',
        'Notice that area. Rest there for a breath.',
        'Now ask: Where is there tension or discomfort?',
        'See if both can be held in awareness at the same time — ease and difficulty together.',
      ],
      benefits: [
        'Reduced all-or-nothing body experience',
        'More nuanced relationship with physical sensation',
        'Capacity to find comfort even in symptomatic states',
      ],
    },
  },

  // ── Somatic Release ──────────────────────────────────────────────────────────

  {
    id: 'jaw-face-soften',
    name: 'Jaw and Face Soften',
    duration: '5 min',
    description: 'Consciously release the face and jaw, where chronic pain tension often hides',
    icon: Zap,
    cue: 'Your face does not need to be held together.',
    difficulty: 'Beginner',
    category: 'Somatic Release',
    purpose: 'Release facial and jaw holding that contributes to headache, neck pain, and nervous system tension',
    intensity: 'low',
    energyRequirement: 'minimal',
    contraindications: ['Acute TMJ — consult dentist before jaw work'],
    tensionFocusAreas: ['Jaw', 'Temples', 'Eyes', 'Forehead', 'Tongue'],
    pacingStyle: 'Breath-by-breath release; no force',
    fibromyalgiaSafetyNotes: 'Never stretch the jaw wide. Only soften and release.',
    preview: {
      instructions: [
        'Let your lips part slightly. Notice if your teeth were touching.',
        'Let your tongue rest in the bottom of your mouth — not pressed to the roof.',
        'Soften the muscles around your eyes. Let your forehead smooth.',
        'Take a slow breath. On the exhale, let your cheeks soften like warm wax.',
        'Stay here, noticing the contrast between holding and releasing.',
      ],
      benefits: [
        'Reduction in jaw tension and associated headache',
        'Softening of upper body holding patterns',
        'Sense of the face becoming "heavier" and more at rest',
      ],
    },
  },

  {
    id: 'gentle-tremor-invitation',
    name: 'Gentle Tremor Invitation',
    duration: '6 min',
    description: 'Allow small natural trembling to arise and move through the body safely',
    icon: Zap,
    cue: 'Trembling is the body releasing, not breaking.',
    difficulty: 'Intermediate',
    category: 'Somatic Release',
    purpose: 'Facilitate natural discharge of held nervous system tension through gentle tremor',
    intensity: 'low',
    energyRequirement: 'low',
    contraindications: ['Epilepsy', 'Very recent physical trauma', 'Significant cardiac conditions'],
    tensionFocusAreas: ['Legs', 'Hips', 'Nervous system overall'],
    pacingStyle: 'Allow and observe; no forcing or amplifying',
    fibromyalgiaSafetyNotes: 'Only invite very gentle, small tremors. If movement becomes large or uncomfortable, place feet on the floor and stop.',
    preview: {
      instructions: [
        'Lie on your back with knees bent, feet flat on the floor.',
        'Slowly let your knees drift apart until you feel a very mild stretch in the inner thighs.',
        'Hold this position for a breath or two.',
        'Notice if any very small, fine trembling arises in the legs or hips.',
        'If it does, simply allow it without trying to control or increase it. Let it complete naturally.',
      ],
      benefits: [
        'Natural discharge of held stress and trauma activation',
        'Deep sense of release in hips and legs',
        'Improved feeling of physical and emotional safety',
      ],
    },
  },

  // ── Postural Reset ───────────────────────────────────────────────────────────

  {
    id: 'crown-lengthen',
    name: 'Crown Lengthen',
    duration: '4 min',
    description: 'Gently elongate the spine from the crown of the head with minimal effort',
    icon: Sun,
    cue: 'Imagine a thread lifting you gently upward.',
    difficulty: 'Beginner',
    category: 'Postural Reset',
    purpose: 'Restore axial length and spinal decompression with almost no muscular effort',
    intensity: 'moderate',
    energyRequirement: 'minimal',
    contraindications: ['Cervical instability'],
    tensionFocusAreas: ['Spine', 'Neck', 'Crown'],
    pacingStyle: 'One gentle intention; no holding',
    fibromyalgiaSafetyNotes: 'This is an imagined lift, not a physical effort. If you try to "do" it, you are doing too much.',
    preview: {
      instructions: [
        'Sit or stand in your current position.',
        'Imagine a very fine silk thread attached to the very top of your head.',
        'Let it gently draw you upward — not a forced pull, just an invitation.',
        'Feel the small space that creates between each vertebra.',
        'Breathe here for several cycles. Notice the length without rigidity.',
      ],
      benefits: [
        'Improved spinal length and ease',
        'Reduced compression in neck and lower back',
        'Greater sense of dignity and calm in the body',
      ],
    },
  },

  {
    id: 'spinal-wave',
    name: 'Gentle Spinal Wave',
    duration: '5 min',
    description: 'A tiny, undulating wave through the spine to release vertebral holding',
    icon: Sun,
    cue: 'Let the spine move like water, not like a rod.',
    difficulty: 'Intermediate',
    category: 'Postural Reset',
    purpose: 'Mobilise the spine gently to reduce stiffness and restore natural movement rhythm',
    intensity: 'moderate',
    energyRequirement: 'low',
    contraindications: ['Spinal fusion', 'Significant disc herniation — check with care team'],
    tensionFocusAreas: ['Whole spine', 'Lower back', 'Sacrum'],
    pacingStyle: 'One slow wave per breath; amplitude very small',
    fibromyalgiaSafetyNotes: 'Keep the movement tiny — no more than 1–2 cm of motion. Larger is not better.',
    preview: {
      instructions: [
        'Sit in a chair with feet flat on the floor.',
        'Begin at the tailbone: on an inhale, let it rock very slightly forward.',
        'Let the wave rise up through the lumbar, thoracic, and cervical spine.',
        'On the exhale, let it reverse: the head nods slightly forward as the tailbone rocks back.',
        'Keep the movement very small and connected to your breath.',
      ],
      benefits: [
        'Reduced spinal stiffness',
        'Improved spinal fluid circulation awareness',
        'A felt sense of the spine as connected and mobile',
      ],
    },
  },

  // ── Sensory Awareness ────────────────────────────────────────────────────────

  {
    id: 'texture-noticing',
    name: 'Texture Noticing',
    duration: '4 min',
    description: 'Explore the textures of surfaces with your fingertips to anchor the present moment',
    icon: Fingerprint,
    cue: 'What does this surface actually feel like?',
    difficulty: 'Beginner',
    category: 'Sensory Awareness',
    purpose: 'Use tactile input to interrupt rumination and return to present-moment experience',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: ['Tactile hypersensitivity — reduce pressure to the lightest possible touch'],
    tensionFocusAreas: ['Hands', 'Attention', 'Nervous system'],
    pacingStyle: 'Leisurely exploration; no rush',
    fibromyalgiaSafetyNotes: 'If touch is painful, use visual observation of textures instead.',
    preview: {
      instructions: [
        'Rest one hand on any nearby surface — fabric, wood, skin, paper.',
        'Begin to explore the texture very slowly with your fingertips.',
        'Notice: is it smooth or rough? Warm or cool? Dry or slightly moist?',
        'Move to a different texture. Compare.',
        'Stay curious, as if you have never touched anything before.',
      ],
      benefits: [
        'Interruption of anxious or ruminative thought cycles',
        'Return to present-moment grounding',
        'Gentle sensory nourishment for the nervous system',
      ],
    },
  },

  {
    id: 'temperature-awareness',
    name: 'Temperature Awareness',
    duration: '4 min',
    description: 'Notice warmth and coolness in the hands as a simple grounding practice',
    icon: Fingerprint,
    cue: 'Your hands always know the temperature.',
    difficulty: 'Beginner',
    category: 'Sensory Awareness',
    purpose: 'Use temperature sensation to anchor attention in the body and present moment',
    intensity: 'very_low',
    energyRequirement: 'minimal',
    contraindications: [],
    tensionFocusAreas: ['Hands', 'Attention'],
    pacingStyle: 'Passive noticing; no movement required',
    fibromyalgiaSafetyNotes: 'Purely observational. Zero physical effort.',
    preview: {
      instructions: [
        'Rest both hands on your lap or any surface.',
        'Close your eyes gently.',
        'Notice the temperature of your palms. Are they warm or cool?',
        'Notice the fingertips — are they the same temperature as the palms?',
        'Now notice the temperature of the air on the backs of your hands.',
        'Stay with these sensations for several minutes.',
      ],
      benefits: [
        'Simple, reliable grounding at any time',
        'Reduction in dissociation or disconnection',
        'Improved capacity to notice subtle body signals',
      ],
    },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const FEATURED_EXERCISE_IDS = EXERCISES.map((e) => e.id)

export function getExerciseById(id: string): SomaticExercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}

export function getExercisesByCategory(category: ExerciseCategory): SomaticExercise[] {
  return EXERCISES.filter((e) => e.category === category)
}

// ─── Motivational messages ────────────────────────────────────────────────────

export const MOTIVATIONAL_MESSAGES: string[] = [
  'Your body is allowed to move slowly today.',
  'Small movement is still healing movement.',
  'You don\'t need to push to make progress.',
  'Gentle consistency matters more than intensity.',
  'Rest is productive. Stillness is medicine.',
  'Your nervous system is doing its best. So are you.',
  'Every breath you take is part of your practice.',
  'There is no right way to feel — only your way.',
  'You are not behind. You are exactly where you are.',
  'Showing up gently is an act of courage.',
  'The body heals in safety, not in strain.',
  'Today\'s smallest movement may be tomorrow\'s foundation.',
  'Pain is information. It is not failure.',
  'You are allowed to need more time.',
  'Softness is strength in a body that has been through much.',
  'Noticing is the practice. You are already doing it.',
]

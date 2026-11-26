/* Functional Foundations: the 4-week program data. Plain text only (no HTML). No dashes used as punctuation in copy. */
window.FOUNDATIONS = (function () {
  'use strict';

  var weeks = [
    {
      n: 1, title: 'Bodyweight foundations', tag: 'Bodyweight only',
      equipment: { label: 'No weights needed', items: ['A sturdy chair', 'A stair or low step', 'A wall or counter', 'A mat or towel (optional)'] },
      goal: 'Learn the movement patterns and build the habit. Everything this week is bodyweight.',
      effort: 'Easy to moderate, about 5 out of 10. Stop each set with 3 or more good reps left in you.',
      tempo: 'Move slowly. Take about 2 seconds to lower and 1 second to rise.',
      loadWord: 'Bodyweight'
    },
    {
      n: 2, title: 'Bodyweight plus a light weight', tag: 'Light weight',
      equipment: { label: 'One light dumbbell or kettlebell (optional)', items: ['One light dumbbell or kettlebell, or a backpack with a few books or water bottles', 'A sturdy chair', 'A stair or low step', 'A mat or towel (optional)'] },
      goal: 'Keep the same patterns and meet your first light weight on a few moves.',
      effort: 'Moderate, about 6 out of 10. Stop each set with 3 reps left in you.',
      tempo: 'Control the lowering for about 2 seconds, rise smoothly.',
      loadWord: 'Light weight'
    },
    {
      n: 3, title: 'Mostly weighted', tag: 'Moderate weight',
      equipment: { label: 'One moderate dumbbell or kettlebell (a pair is a bonus)', items: ['One moderate dumbbell or kettlebell, or a loaded backpack or a water jug', 'A sturdy chair or bench', 'A stair or step', 'A mat or towel (optional)'] },
      goal: 'Most main moves now use a weight. Bodyweight versions stay available for every move.',
      effort: 'Moderate to hard, about 7 out of 10. Stop each set with 2 or 3 reps left in you.',
      tempo: 'Lower for about 3 seconds, then rise with control.',
      loadWord: 'Moderate weight'
    },
    {
      n: 4, title: 'Full weighted sessions', tag: 'Challenging weight',
      equipment: { label: 'One or two dumbbells or kettlebells, challenging but controlled', items: ['One or two dumbbells or kettlebells (or a heavy loaded backpack)', 'A sturdy chair or bench', 'A stair or step', 'A mat or towel (optional)'] },
      goal: 'Put it all together with full weighted sessions, then re-do your self-check from Week 1.',
      effort: 'Hard but clean, about 7 to 8 out of 10. Stop each set with 2 reps left in you.',
      tempo: 'Lower for 3 seconds, pause for 1 second, rise with control.',
      loadWord: 'Challenging weight'
    }
  ];

  /* Shared mobility and warm-up building blocks */
  var warmupLower = [
    { name: 'March in place', dose: '60 seconds, getting a little quicker' },
    { name: 'Ankle rocks (knee over toes, heel down)', dose: '8 each side' },
    { name: 'World\'s greatest stretch', dose: '4 each side' },
    { name: 'Bodyweight squat to a chair', dose: '8 slow reps' },
    { name: 'Standing hip circles', dose: '6 each way, each leg' }
  ];
  var warmupUpper = [
    { name: 'Arm circles, small to big', dose: '10 each direction' },
    { name: 'Cat and cow', dose: '8 slow reps' },
    { name: 'Open book (lying on your side, rotate the chest)', dose: '6 each side' },
    { name: 'Wall slides, arms overhead', dose: '8 reps' },
    { name: 'Glute bridge', dose: '8 reps' }
  ];
  var warmupFull = [
    { name: 'March in place with big arm swings', dose: '60 seconds' },
    { name: 'World\'s greatest stretch', dose: '4 each side' },
    { name: 'Hip hinge, hands on hips', dose: '8 reps' },
    { name: 'Bodyweight squat', dose: '8 reps' },
    { name: 'Bird dog', dose: '5 each side, slow' }
  ];

  /* Each exercise: key, label, cues, easy, harder, byWeek[4] with move, load, sets, reps, rest.
     "easy" is always available to anyone without weights. */
  var workouts = [
    {
      id: 'a', name: 'Legs and balance', short: 'Lower body, single-leg stability, ankles',
      minutes: 40,
      intro: 'Strong legs, steady balance and tough ankles. This is the base for stairs, hills and long days on your feet.',
      warmup: warmupLower,
      exercises: [
        { key: 'squat', label: 'Squat',
          cues: ['Feet about shoulder width, toes slightly out.', 'Sit hips back and down, chest tall.', 'Knees track over your toes, heels stay down.', 'Press the floor away to stand.'],
          easy: 'Sit to a chair, tap lightly, and stand. Use a higher seat if you need to.',
          harder: 'Add a 3 second lower, or pause for 2 seconds at the bottom.',
          byWeek: [
            { move: 'Chair squat (sit down, stand up)', load: 'Bodyweight', sets: 2, reps: '8', rest: '45 seconds' },
            { move: 'Goblet squat, light weight held at your chest', load: 'Light weight', sets: 3, reps: '8', rest: '60 seconds', alt: 'No weights: bodyweight squat, arms reaching forward.' },
            { move: 'Goblet squat, moderate weight', load: 'Moderate weight', sets: 3, reps: '10', rest: '60 seconds', alt: 'No weights: bodyweight squat with a 3 second lower.' },
            { move: 'Goblet squat, challenging weight, 3 second lower', load: 'Challenging weight', sets: 3, reps: '10', rest: '75 seconds', alt: 'No weights: bodyweight squat, 3 second lower and 2 second pause.' }
          ] },
        { key: 'hinge', label: 'Hip hinge',
          cues: ['Soft knees, push hips straight back like closing a car door.', 'Flat back, long neck, eyes on the floor a few feet ahead.', 'Weight stays close to your legs.', 'Squeeze your glutes to stand tall.'],
          easy: 'Hands on hips, tap your hips to a wall behind you.',
          harder: 'Slow the lowering to 3 seconds, or hold the bottom for 2 seconds.',
          byWeek: [
            { move: 'Hip hinge, hands on hips (tap a wall behind you)', load: 'Bodyweight', sets: 2, reps: '8', rest: '45 seconds' },
            { move: 'Romanian deadlift, light weight held at your thighs', load: 'Light weight', sets: 3, reps: '8', rest: '60 seconds', alt: 'No weights: hip hinge with arms crossed, 3 second lower.' },
            { move: 'Romanian deadlift, moderate weight', load: 'Moderate weight', sets: 3, reps: '10', rest: '60 seconds', alt: 'No weights: hold a loaded backpack at your thighs.' },
            { move: 'Romanian deadlift, challenging weight, 3 second lower', load: 'Challenging weight', sets: 3, reps: '10', rest: '75 seconds', alt: 'No weights: loaded backpack, 3 second lower.' }
          ] },
        { key: 'lunge', label: 'Reverse lunge',
          cues: ['Step back softly and land on the ball of the foot.', 'Front shin stays fairly upright, torso tall.', 'Drive through the front heel to return.', 'Keep your hips level and your stance wide enough to feel stable.'],
          easy: 'Hold a chair or wall with one hand and shorten the step.',
          harder: 'Add a 3 second lower or hold a weight in each hand.',
          byWeek: [
            { move: 'Supported reverse lunge (one hand on a chair)', load: 'Bodyweight', sets: 2, reps: '6 each leg', rest: '45 seconds' },
            { move: 'Reverse lunge, no support; a light weight in one hand if you like', load: 'Bodyweight or light weight', sets: 2, reps: '8 each leg', rest: '60 seconds', alt: 'No weights: bodyweight reverse lunge, hands on hips.' },
            { move: 'Reverse lunge holding a moderate weight (goblet or one in each hand)', load: 'Moderate weight', sets: 3, reps: '8 each leg', rest: '60 seconds', alt: 'No weights: bodyweight lunge with a 3 second lower.' },
            { move: 'Reverse lunge holding challenging weight', load: 'Challenging weight', sets: 3, reps: '10 each leg', rest: '75 seconds', alt: 'No weights: bodyweight lunge, 3 second lower and pause.' }
          ] },
        { key: 'balance', label: 'Single-leg balance reach',
          cues: ['Stand on one foot with a soft knee, hips square.', 'Hinge forward and reach your hand toward the floor.', 'Your free leg floats behind you like a see-saw.', 'Pick a spot on the floor to stare at.'],
          easy: 'Keep fingertips on a wall or chair and reach less far.',
          harder: 'Close your eyes for 2 seconds at the top, or hold a weight in the opposite hand.',
          byWeek: [
            { move: 'Single-leg stand with fingertip support (no reach yet)', load: 'Bodyweight', sets: 2, reps: '20 seconds each leg', rest: '30 seconds' },
            { move: 'Single-leg reach to the floor, bodyweight', load: 'Bodyweight', sets: 2, reps: '6 each leg', rest: '45 seconds' },
            { move: 'Single-leg Romanian deadlift, light weight in the opposite hand', load: 'Light weight', sets: 3, reps: '6 each leg', rest: '60 seconds', alt: 'No weights: single-leg reach, hands clasped.' },
            { move: 'Single-leg Romanian deadlift, moderate weight', load: 'Moderate weight', sets: 3, reps: '8 each leg', rest: '60 seconds', alt: 'No weights: single-leg reach, 3 second lower, eyes closed at the top.' }
          ] },
        { key: 'calf', label: 'Calf raise',
          cues: ['Rise tall onto the balls of your feet, pause at the top.', 'Lower for a slow 3 count.', 'Keep your ankles straight, not rolling out.', 'Hold a wall for balance if needed.'],
          easy: 'Two feet, hold a wall, and use less range.',
          harder: 'Single leg, or stand with your toes on a step edge so your heel can drop.',
          byWeek: [
            { move: 'Two-leg calf raise, slow', load: 'Bodyweight', sets: 2, reps: '10', rest: '30 seconds' },
            { move: 'Calf raise, two legs up and one leg down', load: 'Bodyweight', sets: 3, reps: '8 each leg', rest: '30 seconds' },
            { move: 'Single-leg calf raise, light weight in one hand', load: 'Light weight', sets: 3, reps: '10 each leg', rest: '45 seconds', alt: 'No weights: single-leg calf raise, fingertips on a wall.' },
            { move: 'Single-leg calf raise off a step edge, moderate weight', load: 'Moderate weight', sets: 3, reps: '12 each leg', rest: '45 seconds', alt: 'No weights: bodyweight single-leg raise off a step edge.' }
          ] },
        { key: 'deadbug', label: 'Dead bug',
          cues: ['Lie on your back, ribs down, low back gently pressed to the floor.', 'Arms up, knees over hips.', 'Lower one arm and the opposite leg slowly, then switch.', 'Exhale as you reach.'],
          easy: 'Move only the legs, or only the arms, one at a time.',
          harder: 'Hold a light weight straight up over your chest and slow each rep to 4 seconds.',
          byWeek: [
            { move: 'Dead bug, knees bent', load: 'Bodyweight', sets: 2, reps: '5 each side', rest: '30 seconds' },
            { move: 'Dead bug, reach and lower slowly', load: 'Bodyweight', sets: 2, reps: '8 each side', rest: '30 seconds' },
            { move: 'Dead bug, holding a light weight over your chest', load: 'Light weight', sets: 3, reps: '8 each side', rest: '30 seconds', alt: 'No weights: bodyweight dead bug, 4 second reps.' },
            { move: 'Dead bug, holding a moderate weight over your chest', load: 'Moderate weight', sets: 3, reps: '10 each side', rest: '30 seconds', alt: 'No weights: bodyweight dead bug, 4 second reps and a pause.' }
          ] }
      ],
      cooldown: [
        { name: 'Half-kneeling hip flexor stretch', dose: '30 seconds each side' },
        { name: 'Figure 4 stretch on your back', dose: '30 seconds each side' },
        { name: 'Calf stretch against a wall', dose: '30 seconds each side' },
        { name: 'Slow breathing, 5 breaths in through the nose, out through the mouth', dose: '1 minute' }
      ],
      selfCheck: true
    },
    {
      id: 'b', name: 'Push, pull and carry', short: 'Upper body, posture, core, grip',
      minutes: 40,
      intro: 'Upper body strength, a strong back and a stable trunk. Useful for pack straps, handlebars and carrying everyday loads.',
      warmup: warmupUpper,
      exercises: [
        { key: 'push', label: 'Push-up',
          cues: ['Hands under shoulders, body in one straight line.', 'Elbows about 45 degrees from your sides, not flared.', 'Lower your chest to the surface, press the floor away.', 'Squeeze your glutes and keep your ribs down.'],
          easy: 'Raise your hands higher: wall, counter, then a sturdy table.',
          harder: 'Lower for 3 seconds, or raise your feet on a step.',
          byWeek: [
            { move: 'Incline push-up (hands on a counter or sturdy table)', load: 'Bodyweight', sets: 2, reps: '6', rest: '45 seconds' },
            { move: 'Incline push-up, lower surface (couch arm or low bench)', load: 'Bodyweight', sets: 3, reps: '8', rest: '60 seconds' },
            { move: 'Push-up from your knees or the floor', load: 'Bodyweight', sets: 3, reps: '8', rest: '60 seconds' },
            { move: 'Floor push-up, 3 second lower', load: 'Bodyweight', sets: 3, reps: '8 to 10', rest: '75 seconds' }
          ] },
        { key: 'row', label: 'Row and back',
          cues: ['Hinge forward with a flat back, soft knees.', 'Pull your elbow toward your back pocket.', 'Squeeze your shoulder blade toward your spine, then lower slowly.', 'Do not twist your trunk.'],
          easy: 'Lie face down and lift your arms into a Y, T and W shape with no weight.',
          harder: 'Pause for 2 seconds at the top of every rep.',
          byWeek: [
            { move: 'Prone Y, T and W raises (lying face down, no weight)', load: 'Bodyweight', sets: 2, reps: '6 of each shape', rest: '45 seconds' },
            { move: 'Bent-over row, light weight or a backpack held with both hands', load: 'Light weight', sets: 3, reps: '8', rest: '60 seconds', alt: 'No weights: prone Y, T and W raises, 8 of each.' },
            { move: 'One-arm row, moderate weight, free hand on a chair or bench', load: 'Moderate weight', sets: 3, reps: '10 each arm', rest: '60 seconds', alt: 'No weights: backpack or water jug row, or prone raises with a 3 second hold.' },
            { move: 'One-arm row, challenging weight, 2 second pause', load: 'Challenging weight', sets: 3, reps: '10 each arm', rest: '75 seconds', alt: 'No weights: loaded backpack row, 2 second pause.' }
          ] },
        { key: 'press', label: 'Overhead press',
          cues: ['Ribs down, glutes squeezed, standing tall.', 'Press straight up, biceps by your ears.', 'Do not arch your low back to finish.', 'Lower under control to shoulder height.'],
          easy: 'Wall slides with your forearms on the wall, or a half-range press with no weight.',
          harder: 'Press from a half-kneeling stance, or lower for 3 seconds.',
          byWeek: [
            { move: 'Wall slides, arms overhead (no weight)', load: 'Bodyweight', sets: 2, reps: '8', rest: '45 seconds' },
            { move: 'Standing overhead press, light weight or two water bottles', load: 'Light weight', sets: 2, reps: '8', rest: '60 seconds', alt: 'No weights: wall slides, 10 slow reps.' },
            { move: 'Standing overhead press, moderate weight', load: 'Moderate weight', sets: 3, reps: '8', rest: '60 seconds', alt: 'No weights: pike push-up from a chair or low bench.' },
            { move: 'Half-kneeling overhead press, challenging weight', load: 'Challenging weight', sets: 3, reps: '8 each arm', rest: '75 seconds', alt: 'No weights: pike push-up, 3 second lower.' }
          ] },
        { key: 'bridge', label: 'Glute bridge',
          cues: ['Feet flat, knees bent, heels under knees.', 'Push through your heels and squeeze your glutes.', 'Stop when your body makes one line from knees to shoulders.', 'Keep your ribs down so your low back does not arch.'],
          easy: 'Smaller range and a 2 second hold at the top.',
          harder: 'Single leg, or rest a weight on your hips.',
          byWeek: [
            { move: 'Glute bridge', load: 'Bodyweight', sets: 2, reps: '10', rest: '30 seconds' },
            { move: 'Glute bridge with a 2 second hold, then marching legs', load: 'Bodyweight', sets: 3, reps: '8 marches each leg', rest: '30 seconds' },
            { move: 'Glute bridge with a moderate weight resting on your hips', load: 'Moderate weight', sets: 3, reps: '10', rest: '45 seconds', alt: 'No weights: single-leg bridge, 6 each leg.' },
            { move: 'Weighted bridge, challenging weight, or single-leg bridge', load: 'Challenging weight', sets: 3, reps: '10, or 8 each leg', rest: '45 seconds', alt: 'No weights: single-leg bridge, 3 second hold.' }
          ] },
        { key: 'sideplank', label: 'Side plank',
          cues: ['Elbow under your shoulder, body in one line.', 'Press your forearm down and lift your hips.', 'Keep your hips stacked, do not sag or roll back.', 'Breathe slowly the whole time.'],
          easy: 'Stay on your knees and shorten the hold.',
          harder: 'Lift your top leg or top arm for the last 5 seconds.',
          byWeek: [
            { move: 'Side plank from your knees', load: 'Bodyweight', sets: 2, reps: '15 seconds each side', rest: '30 seconds' },
            { move: 'Side plank from your knees', load: 'Bodyweight', sets: 2, reps: '20 seconds each side', rest: '30 seconds' },
            { move: 'Side plank on your feet (or knees if needed)', load: 'Bodyweight', sets: 3, reps: '20 seconds each side', rest: '30 seconds' },
            { move: 'Side plank on your feet with a top leg lift', load: 'Bodyweight', sets: 3, reps: '25 seconds each side', rest: '30 seconds' }
          ] },
        { key: 'carry', label: 'Carry or hold',
          cues: ['Stand tall, shoulders level, ribs stacked over your hips.', 'Do not lean toward the weight. Stay straight.', 'Walk slow, short steps, breathe steadily.', 'Switch sides halfway through each set.'],
          easy: 'Use a lighter weight, a shopping bag, or shorter distance.',
          harder: 'Walk farther, or take a slower, longer stride with a pause on each step.',
          byWeek: [
            { move: 'Tabletop knee hover (hands and knees, lift your knees one inch off the floor)', load: 'Bodyweight', sets: 2, reps: '15 seconds', rest: '30 seconds' },
            { move: 'Suitcase carry, light weight or a bag in one hand', load: 'Light weight', sets: 2, reps: '30 steps each side', rest: '45 seconds', alt: 'No weights: tabletop knee hover, 20 seconds.' },
            { move: 'Suitcase carry, moderate weight', load: 'Moderate weight', sets: 3, reps: '40 steps each side', rest: '45 seconds', alt: 'No weights: a loaded backpack in one hand.' },
            { move: 'Suitcase carry, challenging weight', load: 'Challenging weight', sets: 3, reps: '50 steps each side', rest: '60 seconds', alt: 'No weights: loaded backpack in one hand, slower steps.' }
          ] }
      ],
      cooldown: [
        { name: 'Doorway chest stretch', dose: '30 seconds each side' },
        { name: 'Child\'s pose', dose: '45 seconds' },
        { name: 'Thread the needle (upper back rotation)', dose: '6 each side' },
        { name: 'Slow breathing, 5 breaths in through the nose, out through the mouth', dose: '1 minute' }
      ]
    },
    {
      id: 'c', name: 'Full body and work capacity', short: 'Step-ups, side-to-side strength, shins, circuit',
      minutes: 40,
      intro: 'Everything together. Strong hips and shins for uphill and downhill, side-to-side control, and a short circuit to build your work capacity.',
      warmup: warmupFull,
      exercises: [
        { key: 'stepup', label: 'Step-up',
          cues: ['Place your whole foot on the step.', 'Drive through the heel of the top foot, do not push off the back foot.', 'Stand tall at the top, then lower slowly.', 'Keep your knee in line with your toes.'],
          easy: 'Use a lower step and hold a wall or rail.',
          harder: 'Use a higher step, lower for 3 seconds, or add weight.',
          byWeek: [
            { move: 'Low step-up, bodyweight', load: 'Bodyweight', sets: 2, reps: '6 each leg', rest: '45 seconds' },
            { move: 'Step-up on a higher step, bodyweight; a light weight if it feels easy', load: 'Bodyweight or light weight', sets: 3, reps: '8 each leg', rest: '60 seconds', alt: 'No weights: bodyweight step-up, hands on hips.' },
            { move: 'Step-up, moderate weight in each hand or at your chest', load: 'Moderate weight', sets: 3, reps: '8 each leg', rest: '60 seconds', alt: 'No weights: bodyweight step-up with a 3 second lower.' },
            { move: 'Step-up, challenging weight, 3 second lower', load: 'Challenging weight', sets: 3, reps: '10 each leg', rest: '75 seconds', alt: 'No weights: bodyweight step-up, 3 second lower, high step.' }
          ] },
        { key: 'sidelunge', label: 'Side lunge',
          cues: ['Take a wide step to the side and sit into that hip.', 'The opposite leg stays straight, both feet flat.', 'Chest tall, knee over your toes.', 'Push back to the middle.'],
          easy: 'Take a smaller step and touch the floor with a hand on the chair.',
          harder: 'Hold a weight at your chest or add a 2 second pause at the bottom.',
          byWeek: [
            { move: 'Side step and squat (small step, stay tall)', load: 'Bodyweight', sets: 2, reps: '6 each side', rest: '45 seconds' },
            { move: 'Side lunge, bodyweight', load: 'Bodyweight', sets: 2, reps: '8 each side', rest: '45 seconds' },
            { move: 'Side lunge, moderate weight held at your chest', load: 'Moderate weight', sets: 3, reps: '8 each side', rest: '60 seconds', alt: 'No weights: bodyweight side lunge with a 2 second pause.' },
            { move: 'Side lunge, challenging weight held at your chest', load: 'Challenging weight', sets: 3, reps: '8 each side', rest: '60 seconds', alt: 'No weights: bodyweight side lunge, slow 3 second lower.' }
          ] },
        { key: 'shoulder', label: 'Plank shoulder tap',
          cues: ['Hands under shoulders, feet a bit wider than hips.', 'Tap one shoulder at a time and keep your hips still.', 'Imagine a cup of water on your low back.', 'Breathe out as you tap.'],
          easy: 'Put your hands on a counter or your knees on the floor.',
          harder: 'Bring your feet closer together and slow each tap down.',
          byWeek: [
            { move: 'Incline shoulder tap (hands on a counter)', load: 'Bodyweight', sets: 2, reps: '6 each side', rest: '30 seconds' },
            { move: 'Knee plank shoulder tap', load: 'Bodyweight', sets: 2, reps: '8 each side', rest: '30 seconds' },
            { move: 'Plank shoulder tap, feet wide', load: 'Bodyweight', sets: 3, reps: '8 each side', rest: '30 seconds' },
            { move: 'Plank drag: pull a weight across the floor under your body', load: 'Light to moderate weight', sets: 3, reps: '6 each side', rest: '45 seconds', alt: 'No weights: plank shoulder tap, slow, feet together.' }
          ] },
        { key: 'shin', label: 'Tibialis raise',
          cues: ['Stand with your back against a wall and your feet about 1 foot from it.', 'Lift your toes toward your shins, then lower slowly.', 'Keep your knees straight, soft not locked.', 'This builds the front of the shin for downhill steps and landings.'],
          easy: 'Use shorter reps and keep your feet closer to the wall.',
          harder: 'Single leg, or move your feet farther from the wall.',
          byWeek: [
            { move: 'Wall tibialis raise, two feet', load: 'Bodyweight', sets: 2, reps: '10', rest: '30 seconds' },
            { move: 'Wall tibialis raise, two feet, slow', load: 'Bodyweight', sets: 2, reps: '12', rest: '30 seconds' },
            { move: 'Wall tibialis raise, feet farther from the wall', load: 'Bodyweight', sets: 3, reps: '12', rest: '30 seconds' },
            { move: 'Single-leg tibialis raise, slow', load: 'Bodyweight', sets: 3, reps: '10 each leg', rest: '30 seconds' }
          ] },
        { key: 'circuit', label: 'Work capacity circuit', circuit: true,
          cues: ['Move at a steady pace you could keep up for the full time.', 'Quality first. Slow down before your form breaks.', 'On the rest, walk and breathe.', 'Finish the rounds in order, then move to the cooldown.'],
          easy: 'Use the easy option for each station, shorten the work time by 10 seconds, or take a longer rest.',
          harder: 'Keep the rest the same and add one extra round.',
          byWeek: [
            { move: 'Circuit, bodyweight', load: 'Bodyweight', stations: ['March, knees high', 'Chair squat', 'Incline push-up', 'Step jack (step out to the side, reach overhead)'], work: 30, restSec: 30, rounds: 2, rest: 'Rest 60 seconds between rounds' },
            { move: 'Circuit, bodyweight with an optional light weight on the squat', load: 'Bodyweight or light weight', stations: ['Fast march', 'Squat (goblet if you have a light weight)', 'Incline push-up', 'Reverse lunge, alternating'], work: 30, restSec: 30, rounds: 3, rest: 'Rest 60 seconds between rounds' },
            { move: 'Circuit with a moderate weight', load: 'Moderate weight', stations: ['Goblet squat', 'Push-up (knees if needed)', 'Bent-over row, both hands on one weight', 'Slow mountain climber'], work: 40, restSec: 20, rounds: 3, rest: 'Rest 60 seconds between rounds' },
            { move: 'Circuit with a challenging weight', load: 'Challenging weight', stations: ['Goblet squat', 'Floor push-up', 'Romanian deadlift to row', 'Reverse lunge with the weight'], work: 40, restSec: 20, rounds: 4, rest: 'Rest 60 seconds between rounds' }
          ] }
      ],
      cooldown: [
        { name: 'Walk slowly and let your breathing settle', dose: '2 minutes' },
        { name: 'Standing quad stretch', dose: '30 seconds each side' },
        { name: 'Hamstring sweeps (heels out, hinge, and reach)', dose: '8 each leg' },
        { name: 'Deep squat hold, holding a door frame or post for support', dose: '30 seconds' }
      ]
    },
    {
      id: 'd', name: 'Easy cardio and mobility', short: 'Optional. Easy cardio, then a mobility flow',
      optional: true,
      minutes: null,
      intro: 'Optional, and easy by design. Move at a pace where you can still hold a conversation. Walk, hike, bike, swim or jog gently. Then finish with the mobility flow.',
      cardio: [
        { minutes: 20, text: '20 minutes of easy walking, hiking, biking or gentle jogging. Pick whatever you enjoy.' },
        { minutes: 25, text: '25 minutes, easy and steady. If you like trails, hills or stairs, add a few gentle ones.' },
        { minutes: 30, text: '30 minutes, easy and steady. Add a little hill, stair or trail terrain if it is available to you.' },
        { minutes: 35, text: '35 minutes, easy and steady. Take it outside if you can: a trail, a bike path or a long walk.' }
      ],
      talkTest: 'Talk test: you should be able to speak in full sentences. If you cannot, slow down.',
      mobility: [
        { name: 'Ankle rocks', dose: '10 each side' },
        { name: 'Half-kneeling hip flexor stretch', dose: '45 seconds each side' },
        { name: '90/90 hip switches', dose: '6 each side' },
        { name: 'Cat and cow', dose: '8 slow reps' },
        { name: 'Thread the needle', dose: '6 each side' },
        { name: 'Hamstring sweeps', dose: '8 each leg' },
        { name: 'Child\'s pose', dose: '60 seconds' }
      ],
      exercises: [],
      cooldown: []
    }
  ];

  var selfCheck = [
    { key: 'sts', label: '30 second sit to stand', how: 'Sit on a chair against a wall. Stand fully and sit back down as many times as you can in 30 seconds. Arms crossed.', unit: 'reps' },
    { key: 'balL', label: 'Single-leg balance, left leg', how: 'Stand on one foot, eyes open, hands on hips. Time how long you hold it, up to 60 seconds.', unit: 'seconds' },
    { key: 'balR', label: 'Single-leg balance, right leg', how: 'Same as the left, on the other foot.', unit: 'seconds' },
    { key: 'plank', label: 'Forearm plank hold', how: 'Hold a straight line from head to heels (from your knees if needed). Stop when your form changes.', unit: 'seconds' }
  ];

  var safety = 'This program is general fitness information for healthy adults and is not medical advice. Check with your doctor before starting any new exercise program, especially if you have a health condition, an injury, or you are pregnant. Stop and rest if you feel sharp pain, dizziness or chest discomfort. Choose weights and ranges that feel controlled and comfortable.';

  return { weeks: weeks, workouts: workouts, selfCheck: selfCheck, safety: safety };
})();

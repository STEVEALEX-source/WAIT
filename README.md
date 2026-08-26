# WAIT

A minimalist web tool for managing intrusive thoughts, tracking pause intervals, and grounding yourself during OCD spikes.

## What is WAIT?

WAIT is a no-nonsense, client-side web application designed specifically for people managing OCD and intrusive thoughts. When your brain won't shut up and compulsions are knocking, WAIT helps you:

- Pause & Wait: Set a timer to resist compulsions and break the OCD cycle
- Track Anxiety: Monitor how your anxiety levels change as you wait
- Ground Yourself: Access breathing exercises and distraction tools in moments of crisis
- Document: Keep a personal log of thoughts and patterns (stays on your device)

No cloud storage. No data collection. No distractions. Just you and the ability to WAIT.

## Features

### Core Timer System
- Quick setup: Set anxiety level (1-10), compulsion type, wait duration (5-30 min)
- Real-time tracking: Monitor your anxiety as the timer runs
- Choose your outcome: "I held off" or "Did it anyway" (no judgment)
- Detailed results showing anxiety change and time resisted

### Breathing Exercise
- Guided in-hold-out breathing pattern
- Helps ground you during anxiety spikes
- One-click activation

### Distraction Bank
- Random thoughts/prompts to redirect your attention
- Built-in bank of distractions
- Hit "another one" to get a new prompt

### Personal Reminders
- Customizable note to yourself (e.g., "it always feels permanent until it isn't")
- Change it anytime to match what you need to hear

### History & Stats
- View all attempts with timestamps
- See patterns in your OCD triggers
- Track your progress over time

### Thought Dump
- Leave intrusive thoughts on the page and move on
- Build a list of things that got stuck in your head
- Helps externalize the noise

### Optional PIN Protection
- Password-protect your data with an optional PIN
- Privacy for your thought logs

### Responsive Design
- Optimized for phone, tablet, and desktop
- Works offline entirely
- No installation required

## Getting Started

### Option 1: Use It Now
Simply open [the live app](link-to-your-live-app) in any modern browser. That's it.

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/STEVEALEX-source/WAIT.git
cd WAIT

# Open in your browser (no build step needed!)
# macOS/Linux:
open index.html
# Windows:
start index.html
# Or drag index.html into your browser
```

## How to Use WAIT

### Starting a Wait Session

1. Assess: Rate your current anxiety level (1-10)
2. Categorize: Choose what kind of compulsion you're dealing with:
   - Checking (email, locks, stove, etc.)
   - Washing (hands, skin, surfaces)
   - Making it perfect (organizing, symmetry)
   - Stupid thought loop (can't stop thinking about it)
   - Other / don't know
3. Set Duration: Choose how long you'll wait (5, 10, 15, or 30 minutes)
4. Name the Fear: Write down what the thought says will happen if you don't act
5. Start Waiting: Hit the big button and sit with it

### During the Wait

- Watch the timer count down (or don't—it's also displayed on a separate poster if you want to ignore it)
- Check in on your anxiety level as time passes
- Use breathing or distraction tools if you need them
- Resist the compulsion

### When Time's Up

- I held off: You resisted! The app logs your success
- Did it anyway: No shame. The app still logs it so you can see patterns

## Data & Privacy

- 100% Local: Everything stays on your device. No servers. No accounts.
- Browser Storage: Your history is saved using browser local storage
- Export Anytime: Download your data as a copy whenever you want
- Erase Everything: Wipe all data from your device with one button

## Technical Details

| Aspect | Details |
|--------|---------|
| Built With | Vanilla JavaScript, HTML5, CSS3 |
| Requires | Modern web browser (Chrome, Firefox, Safari, Edge) |
| Size | Lightweight—runs entirely client-side |
| Dependencies | None |
| Browser Support | All modern browsers (iOS Safari, Android Chrome, etc.) |

## UI Philosophy

WAIT's interface is intentionally minimal and distraction-free:

- Poster Aesthetic: Reminds you of a wall with sticky notes—familiar, calming
- Large, Clear Text: Easy to read when anxious
- One Thing at a Time: Focused views so you're not overwhelmed
- No Ads, Tracking, or Bloat: Just tools that work

## Compulsion Types

The app tracks different OCD patterns to help you notice what triggers you most:

| Type | Examples |
|------|----------|
| Checking | Locks, appliances, emails, messages |
| Washing | Hands, body, objects, surfaces |
| Ordering | Symmetry, perfect alignment, arranging things |
| Thought Loops | Rumination, intrusive thoughts you can't stop |
| Other | Anything else that doesn't fit above |

## Contributing

This is a personal project designed to help people. If you have ideas, bug reports, or improvements:

1. Open an [issue](https://github.com/STEVEALEX-source/WAIT/issues)
2. Submit a pull request
3. Be kind—this tool exists to help people in crisis

## Disclaimer

WAIT is NOT a substitute for professional help. If you're struggling with OCD, anxiety, or other mental health challenges, please reach out to:

- IOCDF: International OCD Foundation (www.iocdf.org)
- ADAA: Anxiety & Depression Association of America (www.adaa.org)
- Your therapist or doctor: For personalized treatment

This tool is meant as a complementary resource to professional support.

## License

This project is open source and available under the MIT License.

## Roadmap (Future Ideas)

- [ ] Sync across devices (optional, encrypted)
- [ ] Customizable distraction library
- [ ] Export to CSV for sharing with therapist
- [ ] Mobile app wrapper
- [ ] Offline-first synchronization
- [ ] Dark mode theme option

## Acknowledgments

Built with care for anyone who knows what it's like when OCD takes the wheel. If WAIT has helped you, consider starring the repo or sharing it with someone who might benefit.

Just wait. You've got this.

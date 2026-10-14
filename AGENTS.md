# Project conventions
- Use the shared election ranking helper for on-screen standings and PDF output so ties receive identical competition ranks.
- Keep candidate voting controls in registration order in both layouts to avoid moving targets while counting; only the results ranking is sorted by votes.
- Share candidate controls between grid and list layouts to keep editing, deletion, accessibility, and vote adjustment behavior consistent.
- Voting data remains session-only until persistent storage is explicitly requested; never imply a saved or shared election.
- Export results through the dedicated PDF utility, with shared tie ranking and page space checks before each position heading.
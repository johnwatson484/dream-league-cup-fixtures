import groups from './groups.js'
import weeks from './weeks.js'

const BYE = 'Bye'

function calculateSchedule() {
  for (const group of groups) {
    console.log(`${ group.name } fixtures:`)
    const initialFixtures = []

    let totalManagers = group.managers.length

    // if odd number of managers, add a BYE manager to make it even
    if (totalManagers % 2 !== 0) {
      group.managers.push(BYE)
      totalManagers++
    }

    const managerFixtures = calculateFixtures(totalManagers)

    for (const manager of managerFixtures) {
      for (let i = 0; i < manager.matches.length; i++) {
        initialFixtures.push({ weekIndex: i, home: group.managers[manager.managerIndex], away: group.managers[manager.matches[i]] })
      }
    }

    let confirmedFixtures = []

    for (let i = 0; i < initialFixtures.length; i++) {
      const conflictingFixture = confirmedFixtures.find(x => x.weekIndex === initialFixtures[i].weekIndex && (x.home === initialFixtures[i].home || x.away === initialFixtures[i].home || x.home === initialFixtures[i].away || x.away === initialFixtures[i].away))
      if (conflictingFixture) {
        if (i % 2 === 0) {
          initialFixtures[i].weekIndex = initialFixtures[i].weekIndex + totalManagers - 1
        } else {
          conflictingFixture.weekIndex = conflictingFixture.weekIndex + totalManagers - 1
          conflictingFixture.weekNumber = weeks[conflictingFixture.weekIndex]
        }
      }
      initialFixtures[i].weekNumber = weeks[initialFixtures[i].weekIndex]
      confirmedFixtures.push(initialFixtures[i])
    }

    confirmedFixtures.sort((a, b) => a.weekIndex - b.weekIndex)

    // remove BYE fixtures
    const finalFixtures = confirmedFixtures.filter(x => x.home !== BYE && x.away !== BYE)

    console.log(finalFixtures.map(getFixtureString).join('\n'))
  }
}

function calculateFixtures(numberOfTeams) {
  let rounds = Array.from({ length: numberOfTeams - 1 }, (_, j) => calculateTeamFixtures(numberOfTeams, j))
  return Array.from({ length: numberOfTeams }, (_, i) => ({
    managerIndex: i,
    matches: rounds.map(round => round[i])
  }))
}

function calculateTeamFixtures(numberOfTeams, j) {
  let m = numberOfTeams - 1
  let round = Array.from({ length: numberOfTeams }, (_, i) => (m + j - i) % m) // circular shift
  round[round[m] = j * (numberOfTeams >> 1) % m] = m // swapping self-match
  return round
}

function getFixtureString(fixture) {
  return `Week ${fixture.weekNumber}: ${ fixture.home } vs ${ fixture.away }`
}

calculateSchedule()

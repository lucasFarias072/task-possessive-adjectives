const niceGreen = "rgb(100, 200, 0)"
let scoreVal = 0
const cleanStorageButton = document.getElementById("clean-storage-btn")
const homeTaskButton = document.getElementById("home-task-btn")
const classTaskButton = document.getElementById("class-task-btn")
const inputsGame = document.getElementById("inputs-game")
const score = document.getElementById("score")
const tutorialBox = document.getElementById("tutorial-section")
const sentencesBox = document.getElementById("sentences-box")

const msgActivityState = document.getElementById("activity-state")
const msgActivityProcedure = document.getElementById("activity-procedure")

cleanStorageButton.addEventListener("click", () => {
  localStorage.removeItem("last-score")
  scoreVal = 0
  score.textContent = `${scoreVal}`
})

homeTaskButton.addEventListener("click", () => {
  if (sentencesBox.getAttribute("class") === "") {
    sentencesBox.classList.add("std-vanish")
    tutorialBox.classList.add("std-vanish")
    document.getElementById("home-launcher").style.transform = "rotate(90deg)"
    homeTaskButton.style.backgroundColor = "red"
  } else {
    sentencesBox.classList.remove("std-vanish")
    tutorialBox.classList.remove("std-vanish")
    document.getElementById("home-launcher").style.transform = "rotate(45deg)"
    homeTaskButton.style.backgroundColor = niceGreen
  }
})

classTaskButton.addEventListener("click", () => {
  if (inputsGame.getAttribute("class") === "") {
    inputsGame.classList.add("std-vanish")
    document.getElementById("class-launcher").style.transform = "rotate(90deg)"
    classTaskButton.style.backgroundColor = "red"
  } else {
    inputsGame.classList.remove("std-vanish")
    document.getElementById("class-launcher").style.transform = "rotate(45deg)"
    classTaskButton.style.backgroundColor = niceGreen
  }
})

function getRandomIndex(tail, head) {
  return Math.floor(Math.random() * (head - tail) + tail)
}

function getColor() {
  let color = "#"
  const numbers = "0.1.2.3.4.5.6.7.8.9.A.B.C.D.E.F".split(".")
  for(let i = 0; i < 6; i++) {
    color += numbers[getRandomIndex(0, numbers.length)]
  }
  return color
}

function makeColorStorm(container) {
  for(let i = 0; i < container.length; i++) {
    container[i].style.color = getColor()
  }
}

function getPossessiveAdjetive() {
  const possessiveAdjectives = [
    "My", "Your", "His", "Her", "Its", "Our", "Your", "Their"
  ]
  const i = getRandomIndex(0, possessiveAdjectives.length)
  return {
    pos: i,
    adj: possessiveAdjectives[i], 
    category: i <= 4 ? 1 : 2
  }
}

function getAnimalNoun() {
  const nounsSgl = [
    "child", "rabbit", "dolphin", "owl", "cat", "dog", "ant", "whale", "bear", "lizard"
  ]
  const nounsPl = [
    "children", "rabbits", "dolphins", "owls", "cats", "dogs", "ants", "whales", "bears", "lizards"
  ]

  const nounGrammarState = getRandomIndex(0, 2)
  
  const noun = nounGrammarState == 1 ? nounsSgl[getRandomIndex(0, nounsSgl.length)] : nounsPl[getRandomIndex(0, nounsPl.length)]
  const negatory = getRandomIndex(0, 2)
  const negatoryResult = negatory == 0 ? "" : "not"

  return {
    noun: noun,
    toBe: nounsSgl.includes(noun) ? `is ${negatoryResult}` : `are ${negatoryResult}` 
  }
}

function getAnimalAdjective() {
  const adjectives = [
    "cute", "scary", "stubborn", "troublesome", "smart", "dumb", "silly", "tender", "noisy", "sleepy"
  ]
  const i = getRandomIndex(0, adjectives.length)
  return {
    i: i,
    adj: adjectives[i]
  }
}

function applyHint(assertion, container, hintTxt) {
  if (assertion) {
    const hint = document.createElement("span")
    hint.textContent = hintTxt
    hint.classList.add("std-sentence-frame-adjustments")
    hint.classList.add("std-hint-make-up")
    container.appendChild(hint)
  }
}

function buildSentenceFrame(frameTag) {
  frameTag.setAttribute("class", "flex row going-center sentence-frame")
  frameTag.style.backgroundImage = "linear-gradient(45deg, blue, rgb(20, 40, 60), rgb(40, 80, 160)"
  frameTag.style.border = "solid 1.5px aqua"
  frameTag.style.margin = ".4rem"
}

function buildSentenceInput() {
  const inputElement = document.createElement("input")
  inputElement.setAttribute("class", "answer")
  inputElement.setAttribute("placeholder", "")
  inputElement.setAttribute("size", "3")
  inputElement.classList.add("std-input-style")
  return inputElement
}

function nullContentFromTag(htmlTag) {
  htmlTag.textContent = ""
}

function buildSentence(htmlContainer, sentenceElement, answers) {
  const sentenceDiv = document.createElement("div")
  buildSentenceFrame(sentenceDiv)
  
  // Iterate over the sentence currently as a list of strings
  for (let i = 0; i < sentenceElement.sentence.length; i++) {
    
    const sentenceWord = document.createElement("span")
    sentenceWord.classList.add("std-sentence-frame-adjustments")
    
    // [leftovers] Students can write in this area with a marker, instead of using the keyboard
    if (i == 0) {
      sentenceWord.classList.add("std-no-make-up")
    } 

    // Input creation and setup (the 2nd element of the sentence)
    else if (i == 1) {
      // remove the marked reference where the input will be
      sentenceElement.sentence.splice("_", 1) 
      
      // and put an input replacing it
      sentenceDiv.appendChild(buildSentenceInput())
    }
    
    // Everything else that is not the possessive adjective will receive this style
    else {
      sentenceWord.classList.add("std-make-up")
    }
    
    // Put the words together and place the whole thing in the frame
    sentenceWord.textContent = sentenceElement.sentence[i]
    sentenceDiv.appendChild(sentenceWord)

  }
  
  // The first tag from the "sentenceDiv" has the possessive pronoun
  // I need two versions of it: the one with capital letter and the one without it
  // Inputs from exercise will consider correct adjectives with first letter: upper || lower
  const adjectiveAnswerSheet = {
    txtUpper: sentenceDiv.childNodes[0].textContent,
    txtLower: convertIntoTitle(sentenceDiv.childNodes[0].textContent, false)
  }

  // Query source to check answer on inputs from exercise (not the table exercise)
  answers.push(adjectiveAnswerSheet)
  
  // When the input is guessed correctly, the text it was extracted from is no longer available
  // So, the possessive adjective won't be shown if the answer is correct
  // To correct this, b4 wiping the adjective, its value will be placed into a dynamic attribute
  appendDynamicAttribute(sentenceDiv.childNodes[0], "data-current-adjective", sentenceDiv.childNodes[0].textContent)
  // This adjective is saved here
  const currentAdjective = sentenceDiv.childNodes[0].getAttribute("data-current-adjective")
  // Then the source tag is nulled
  nullContentFromTag(sentenceDiv.childNodes[0], "from the possessive adjective tag")
  // Some needed correction (I won't explain)
  sentenceDiv.childNodes[2].classList.add("std-make-up")
  
  // The last element of each sentence (the hint) will be built according to the adjective 
  applyHint(currentAdjective === "My", sentenceDiv, "I")
  applyHint(currentAdjective === "Your", sentenceDiv, "You")
  applyHint(currentAdjective === "His", sentenceDiv, "He")
  applyHint(currentAdjective === "Her", sentenceDiv, "She")
  applyHint(currentAdjective === "Its", sentenceDiv, "It")
  applyHint(currentAdjective === "Our", sentenceDiv, "We")
  // applyHint(currentAdjective === "Your" && sentenceElement.pos === 2, sentenceDiv, "You(s)")
  // applyHint(currentAdjective === "Your" && sentenceElement.pos === 6, sentenceDiv, "You")
  applyHint(currentAdjective === "Their", sentenceDiv, "They")
  
  // Finally, the sentence is appended (there will be 50 of it)
  htmlContainer.appendChild(sentenceDiv)
}

function buildInputsGame(container) {
  const pronouns = ["I", "you", "he", "she", "it", "we", "they"]
  const adjectives = ["my", "your", "his", "her", "its", "our", "their"]
  for (let i = 0; i < 7; i++) {
    const row = document.createElement("div")
    row.setAttribute("class", "flex row going-center")
    const inputs = [document.createElement("input"), document.createElement("input")]

    const chanceToAdd = getRandomIndex(0, 2)
    if (chanceToAdd === 1) {
      inputs[0].value = pronouns[i]
      // Save the adjective
      inputs[1].setAttribute("class", adjectives[i])
    } else {
      inputs[1].value = adjectives[i]
      // Save the pronoun
      inputs[0].setAttribute("class", pronouns[i])
    }
    
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute("size", "5")
      inputs[i].classList.add("std-input-style-for-inputs-game")
      i === 0 ? inputs[0].classList.add("pronoun") : inputs[1].classList.add("adjective")
      row.appendChild(inputs[i])
      container.appendChild(row)
    }
  }
}

function preserveData(dataKeyName, dataContinuousValue, dataResetedValue) {
  localStorage.getItem(dataKeyName) != null 
  ? localStorage.setItem(dataKeyName, parseInt(dataContinuousValue)) 
  : localStorage.setItem(dataKeyName, dataResetedValue)
}

function getFeelingMsg(txt) {
  const feelings = ["🙂", "😃", "😊", "🤗", "⭐", "⚡"]
  return `${txt} ${feelings[getRandomIndex(0, feelings.length)]}`
}

function getUpdateMsg() {
  const workers = ["👷‍♂️", "👷🏻‍♀️"]
  const tools = ["🔧", "🔨", "⛏️", "👌", "💪"]
  return `${workers[getRandomIndex(0, workers.length)]} ${tools[getRandomIndex(0, tools.length)]} novos exemplos 🚧`
}

function rebootAfterClassTaskCompletion(accuracy, completionRefVal, blankInputsQueryGroup, inkColorRef, stateTag, procedureTag) {
  if (accuracy.length === completionRefVal) {
    if (blankInputsQueryGroup[accuracy.length - 1].tag.style.backgroundColor === inkColorRef) {
      document.getElementById("buttons-section").classList.add("std-vanish")
      document.getElementById("inputs-game-section").classList.add("std-vanish")
      document.getElementById("sentences-section").classList.add("std-vanish")
      document.getElementById("reset-section").classList.remove("std-vanish")
      document.getElementById("reset-section").style.minHeight = "100vh"

      const tagsToShiftColor = [
        stateTag, procedureTag
      ]
      
      setTimeout(() => {
      const info = "Atividade de classe completada!"
      stateTag.textContent = info
      stateTag.style.color = getColor()
      setTimeout(() => {
        procedureTag.textContent = getUpdateMsg()
        makeColorStorm(tagsToShiftColor)
        setTimeout(() => {
          stateTag.textContent = getFeelingMsg(info)
          procedureTag.textContent = getUpdateMsg() + "."
          makeColorStorm(tagsToShiftColor)
          setTimeout(() => {
            stateTag.textContent = getFeelingMsg(info)
            procedureTag.textContent = getUpdateMsg() + ".."
            makeColorStorm(tagsToShiftColor)
            setTimeout(() => {
              stateTag.textContent = getFeelingMsg(info)
              procedureTag.textContent = getUpdateMsg() + "..."
              makeColorStorm(tagsToShiftColor)
              setTimeout(() => {
                stateTag.textContent = getFeelingMsg(info)
                window.location.reload()
              }, getRandomIndex(1200, 2400))
            }, getRandomIndex(400, 1200))
          }, getRandomIndex(400, 1200))
        }, getRandomIndex(400, 1200))
      }, getRandomIndex(400, 1200))
    }, getRandomIndex(400, 1200))

    }
  }
  
  preserveData("last-score", score.textContent, 0)
}

function rebootAfterHomeTaskCompletion(tail, head, score, stateTag, procedureTag) {
  if (tail === head) {
    document.getElementById("buttons-section").classList.add("std-vanish")
    document.getElementById("inputs-game-section").classList.add("std-vanish")
    document.getElementById("sentences-section").classList.add("std-vanish")
    document.getElementById("reset-section").classList.remove("std-vanish")
    document.getElementById("reset-section").style.minHeight = "100vh"
    
    preserveData("last-score", score.textContent, 0)

    const tagsToShiftColor = [
      stateTag, procedureTag
    ]

    setTimeout(() => {
      const info = "Atividade de casa em andamento!" 
      stateTag.textContent = info
      stateTag.style.color = getColor()
      setTimeout(() => {
        procedureTag.textContent = getUpdateMsg()
        makeColorStorm(tagsToShiftColor)
        setTimeout(() => {
          stateTag.textContent = getFeelingMsg(info)
          procedureTag.textContent = getUpdateMsg() + "."
          makeColorStorm(tagsToShiftColor)
          setTimeout(() => {
            stateTag.textContent = getFeelingMsg(info)
            procedureTag.textContent = getUpdateMsg() + ".."
            makeColorStorm(tagsToShiftColor)
            setTimeout(() => {
              stateTag.textContent = getFeelingMsg(info)
              procedureTag.textContent = getUpdateMsg() + "..."
              makeColorStorm(tagsToShiftColor)
              setTimeout(() => {
                stateTag.textContent = getFeelingMsg(info)
                window.location.reload()
              }, getRandomIndex(1200, 2400))
            }, getRandomIndex(400, 1200))
          }, getRandomIndex(400, 1200))
        }, getRandomIndex(400, 1200))
      }, getRandomIndex(400, 1200))
    }, getRandomIndex(400, 1200))
  }
}

function convertIntoTitle(txt, minorToMajor) {
  return minorToMajor 
  ? String.fromCharCode(txt.charCodeAt(0) - 32) + txt.substring(1, txt.length)
  : String.fromCharCode(txt.charCodeAt(0) + 32) + txt.substring(1, txt.length)
}

function appendDynamicAttribute(htmlTag, atribLabel, atribVal) {
  htmlTag.setAttribute(atribLabel, atribVal)
}

function createSentencesSet(amount, container) {
  for (let i = 0; i < amount; i++) {
    const possessiveAdjective = getPossessiveAdjetive()
    const noun = getAnimalNoun()
    const adjective = getAnimalAdjective()
    // underline _ references the input on the template (it will be replaced)
    const sentence = `${possessiveAdjective.adj} _ ${noun.noun} ${noun.toBe} ${adjective.adj}`
    const sentenceFinal = sentence.replace(/\s+/g, " ")
    
    const sentenceReport = {
      sentence: sentenceFinal.split(" "),
      size: sentenceFinal.split(" ").length,
      // [deprecated] this is required to distinguish "Your" singular from "Your" plural
      pos: possessiveAdjective.pos
    }

    container.push(sentenceReport)
  }
}

// Each answer
const answers = []

// Each index is a dictionary with keys: [sentence, size]
const sentencesDatabase = []

createSentencesSet(5, sentencesDatabase)

// Each sentence (par 2) will be passed and each letter from it will be a "span" element
for (let i = 0; i < sentencesDatabase.length; i++) {
  buildSentence(sentencesBox, sentencesDatabase[i], answers)
}

buildInputsGame(inputsGame)

const allInputs = document.querySelectorAll(".answer")
const allInputsFromInputsGame = document.querySelectorAll(".std-input-style-for-inputs-game")
const blankOnes = []
const filledOnes = []
const accuracy = []

score.textContent = parseInt(localStorage.getItem("last-score"))

const loop = setInterval(() => {
  // if (window.innerWidth < 600) {}
  score.textContent === "NaN" ? score.textContent = "0" : null
  
  rebootAfterHomeTaskCompletion(scoreVal, 5, score, msgActivityState, msgActivityProcedure)
  rebootAfterClassTaskCompletion(accuracy, 7, blankOnes, niceGreen, msgActivityState, msgActivityProcedure)

  for (let i = 0; i < allInputs.length; i++) {

    // If user types, highstd-light target input
    if (allInputs[i].value != "") {
      allInputs[i].style.border = "solid 3px yellow"
    } else {
      allInputs[i].style.border = "inherit"
    }

    // If answer is correct
    if (allInputs[i].value === answers[i].txtLower || allInputs[i].value === answers[i].txtUpper) {
      const hiddenAdjective = sentencesBox.childNodes[i].childNodes[0]
      const inputFromSentence = sentencesBox.childNodes[i].childNodes[1]
      
      if (!inputFromSentence.getAttribute("class").split(" ").includes("answered")) {
        scoreVal++
        // score.textContent = scoreVal
        score.textContent = `${parseInt(score.textContent) + 1}`
        inputFromSentence.setAttribute("class", "answered")
        inputFromSentence.style.display = "none"
        hiddenAdjective.textContent = hiddenAdjective.getAttribute("data-current-adjective")
        
        // Modify the correct sentence to be less visible and remove hint (last item) to avoid cheating
        const wholeSentence = sentencesBox.childNodes[i].childNodes
        for (let i = 0; i < wholeSentence.length; i++) {
          wholeSentence[i].style.opacity = ".5"
          if (i === wholeSentence.length - 1) {
            // wholeSentence[i].classList.add("std-vanish")
            wholeSentence[i].textContent = ""
            wholeSentence[i].classList.add("std-done")
          }
        }
      }
      sentencesBox.childNodes[i].childNodes[0].classList.remove("std-no-make-up")
      sentencesBox.childNodes[i].childNodes[0].classList.add("std-adjective-make-up")
    } 
  }

  for (let i = 0; i < allInputsFromInputsGame.length; i++) {
    const classNameLenght = allInputsFromInputsGame[i].getAttribute("class").split(" ").length
    const txtRegular = allInputsFromInputsGame[i].getAttribute("class").split(" ")[0]
    let wordDatabase = {}

    // If input is blank
    if (classNameLenght === 3) {
      if (!blankOnes.includes(allInputsFromInputsGame[i])) {
        
        wordDatabase = {
          tag: allInputsFromInputsGame[i], 
          txt: txtRegular, 
          txtUpper: convertIntoTitle(txtRegular, true),
          pos: i
        }

        blankOnes.push(wordDatabase)
      }
    } 

    // If input is filled with pronoun or adjective
    else {
      if (!filledOnes.includes(allInputsFromInputsGame[i])) {
        
        wordDatabase = {
          tag: allInputsFromInputsGame[i], 
          txt: allInputsFromInputsGame[i].value, 
          pos: i
        }

        filledOnes.push(wordDatabase)
      }
    }
  }

  // Iterate over the blank inputs
  blankOnes.forEach((blankInput, pos) => {
    // blankInput.tag.value = String.fromCharCode(blankInput.tag.value.charCodeAt(0) + 32)
  
    // If the blank input is being filled up
    if (blankInput.tag.value != "") {
      // And becomes equals to the expected value
      // Or statements is here because cellphones put first letters as capital letters
      if (blankInput.tag.value === blankOnes[pos].txt || blankInput.tag.value === blankOnes[pos].txtUpper) {
        // Paint to show accuracy
        blankOnes[pos].tag.style.backgroundColor = "rgb(100, 200, 0)"
        !accuracy.includes(blankOnes[pos].txt) ? accuracy.push(blankOnes[pos].txt) : null
        // console.log(accuracy)
      }
      // Unpaint when not equal
      else {
        blankOnes[pos].tag.style.backgroundColor = "rgb(30, 120, 200)"
        accuracy.includes(blankOnes[pos].txt) ? accuracy.splice(blankOnes[pos].txt, 1) : null
      }
    }
    // Unpaint when not equal and blank
    else {
      blankOnes[pos].tag.style.backgroundColor = "rgb(30, 120, 200)"
      accuracy.includes(blankOnes[pos].txt) ? accuracy.splice(blankOnes[pos].txt, 1) : null
    }
  })
}, 1000)

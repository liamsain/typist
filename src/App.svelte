<script>
  import { onMount, tick } from "svelte";
  const hundredMostCommonWords = `a,about,all,also,and,as,at,be,because,but,by,can,come,could,day,do,even,find,first,for,from,get,give,go,have,he,her,here,him,his,how,I,if,in,into,it,its,just,know,like,look,make,man,many,me,more,my,new,no,not,now,of,on,one,only,or,other,our,out,people,say,see,she,so,some,take,tell,than,that,the,their,them,then,there,these,they,thing,think,this,those,time,to,two,up,use,very,want,way,we,well,what,when,which,who,will,with,would,year,you,your`.split(
    ","
  );
  const localStorageHighScoresKey = 'typist__high-scores';
  let wordsTyped = 0;
  let inputText = "";
  let secondsElapsed = 0;
  let currentWordIndex = 0;
  let dateTimeTypingStarted;
  let completedSession = false;
  let timerStarted = false;
  let timeout;
  $: currentWordIsSpeltIncorrectly =
    inputText.length && 
    wordsToType.length && 
    !wordsToType[currentWordIndex].startsWith(inputText);
  $: timeElapsedDisplay = secondsElapsed === 60 ? `01:00` : `00:${secondsElapsed < 10 ? '0': ''}${secondsElapsed.toString()}`;
  let highScores = getHighScores();

  function getHighScores() {
    const scoreString = localStorage.getItem(localStorageHighScoresKey); 
    if (scoreString && scoreString.length) {
      return JSON.parse(scoreString);
    }
    return [];
  }

  function updateHighScores(score) {
    if (score === 0) {
      return;
    }
    let highScores = getHighScores();
    if (highScores.length > 0) {
      const lowerScoreHighScoreIndex = highScores.findIndex(highScore => highScore < score);
      if (lowerScoreHighScoreIndex > -1) {
        highScores[lowerScoreHighScoreIndex] = score;
      }
    } else {
      highScores.push(score);
    }
    localStorage
      .setItem(localStorageHighScoresKey, JSON.stringify(
        highScores
          .sort((a,b) => b - a)
          .slice(0, 5)));
  }

  const getRandomNumBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let wordsToType = new Array(3000)
    .fill("")
    .map((x) => hundredMostCommonWords[getRandomNumBetween(0, 99)]);

  function startTime() {
    const now = new Date();
    const secondsBetweenNowAndWhenTypingBegan =
      (now - dateTimeTypingStarted) / 1000;
    secondsElapsed = Math.round(secondsBetweenNowAndWhenTypingBegan);
    if (secondsElapsed >= 60) {
      completedSession = true;
      clearTimeout(timeout);
      wordsToType = [];
      document.querySelector('#input-text').blur();
      updateHighScores(wordsTyped);
      highScores = getHighScores();
      return;
    }
    timeout = setTimeout(startTime, 500);
  }

  function handleKeyDown(ev) {
    if (completedSession) {
      return;
    }
    if (!timerStarted) {
      dateTimeTypingStarted = new Date();
      startTime();
      timerStarted = true;
    }

    if (ev.key === " ") {
      ev.preventDefault();
      const wordMatches = inputText === wordsToType[currentWordIndex];
        
      if (wordMatches) {
        wordsTyped += 1;
        inputText = "";
        if (currentWordIndex === wordsToType.length) {
          currentWordIndex = 0;
        }
        wordsToType = wordsToType.slice(1);
      }
    }
  }

  onMount(() => {
    document.querySelector("#input-text").focus();
  });

  async function restart() {
    timerStarted = false;
    secondsElapsed = 0;
    inputText = '';
    wordsTyped = 0;
    wordsToType = new Array(3000)
      .fill("")
      .map((x) => hundredMostCommonWords[getRandomNumBetween(0, 99)]);
    completedSession = false;
    await tick();
    document.querySelector("#input-text").focus();
    dateTimeTypingStarted = null;
  }
</script>

<style>
  .word {
    padding: 6px;
    margin: 0;
    border: 1px solid transparent;
    font-weight: 600;
  }
  .word--active {
    color: #51726c;
  }
  .word-container {
    margin-bottom: 80px;
  }
  .word-container__inner {
    left: 50%;
    position: absolute;
    overflow-y: hidden;
    width: 350px;
    display: flex;
  }
.word-container__inner::-webkit-scrollbar {
  display: none;
}
.word-container__inner {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
  .word--incorrect {
    color: red;
  }
  .word-container p {
    text-align: center;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>


<scores>
{#if highScores.length}
  <h4>High scores</h4>
  <ol>
    {#each highScores as score}
      <li>
        {score}
      </li>
    {/each}
  </ol>
{/if}
</scores>
<main>
  <h1>Typist</h1>
  <p>{timeElapsedDisplay}</p>
  <div class="word-container">
    <div class="word-container__inner">
      {#each wordsToType as word, i}
        <p
          class:word--active={i === currentWordIndex}
          class="word"
          class:word--incorrect={i === currentWordIndex && currentWordIsSpeltIncorrectly}>
          {word}
        </p>
      {/each}
    </div>
  </div>
  {#if !completedSession}
  <input bind:value={inputText} id="input-text" on:keydown={handleKeyDown} autocomplete="off"/>
  {/if}
  {#if completedSession}
    <p>You typed {wordsTyped} words in a minute!</p>
    <button on:click={restart}>Go again</button>
  {/if}
</main>

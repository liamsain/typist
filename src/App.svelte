<script>
  import { onMount } from 'svelte';

  const getRandomNumBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;
  const hundredMostCommonWords = `a,about,all,also,and,as,at,be,because,but,by,can,come,could,day,do,even,find,first,for,from,get,give,go,have,he,her,here,him,his,how,I,if,in,into,it,its,just,know,like,look,make,man,many,me,more,my,new,no,not,now,of,on,one,only,or,other,our,out,people,say,see,she,so,some,take,tell,than,that,the,their,them,then,there,these,they,thing,think,this,those,time,to,two,up,use,very,want,way,we,well,what,when,which,who,will,with,would,year,you,your`
    .split(',');
  const wordsToType = new Array(10)
    .fill('')
    .map(x => hundredMostCommonWords[getRandomNumBetween(0, 99)]);
    let inputText = '';
  let currentWordIndex = 0;

  function handleKeyUp(ev) {
    console.log(ev.target.value);
    if (ev.target.value === `${wordsToType[currentWordIndex]} `) {
      currentWordIndex += 1;
      if (currentWordIndex === wordsToType.length) {
        currentWordIndex = 0;
      }
      inputText = '';
    }
  }

  onMount(() => {
    document.querySelector('#input-text').focus();
  });

</script>

<main>
  <h1>Typist</h1>
  <div class="word-container">
    {#each wordsToType as word}
    <p class:word--active="{word === wordsToType[currentWordIndex]}">
      {word} 
    </p>
    {/each}
  </div>
  <input bind:value={inputText} id="input-text" on:keyup={handleKeyUp}/>
</main>

<style>
  .word--typed {

  }
  .word--active {
    color: red;
  }
  .word-container {
    display: flex;
    justify-content:space-around;
  }
  .word-container p{
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
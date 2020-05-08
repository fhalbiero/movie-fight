const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },

    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '8a2e717d',
                s: searchTerm
            }
        });
    
        if (response.data.Error) return [];
    
        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

const fetchData = async function(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '8a2e717d',
            s: searchTerm
        }
    });

    if (response.data.Error) return [];

    return response.data.Search;
}


let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {    
    response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '8a2e717d',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data); 

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    } 
    
    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats  = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
   
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}


const movieTemplate = movieDetail => {

    const { BoxOffice, Metascore, imdbRating, imdbVotes, 
            Title, Genre, Plot, Awards, Poster } = movieDetail;

    const dollars = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const score   = parseInt(Metascore);
    const rating  = parseFloat(imdbRating);
    const votes   = parseInt(imdbVotes.replace(/,/g, ''));

    const awards  = Awards.split(' ').reduce((prev, word) => {
          const value = parseInt(word);  
          
          if (isNaN(value)) return prev;

          return prev + value;
    }, 0);


    return `
        <article class="media">
            <figure class="media-left">
                <p>
                    <img src="${Poster}" width="120px" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${Title}</h1>
                    <h4>${Genre}</h4>
                    <p>${Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${score} class="notification is-primary">
            <p class="title">${Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}





/* createAutoComplete({
    root: document.querySelector('.autocomplete'),

    renderOption(photo) {
       return `
            <img src="${photo.thumbnailUrl}"/>
            ${photo.title}
        `;
    },

    onOptionSelect(photo) {
        onMovieSelect(photo);
    },

    inputValue(photo) {
        return photo.Title;
    },

    async fetchData(searchTerm) {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos?albumId=1');
    
        if (response.data.Error) return [];
    
        return response.data;
    }
}); */
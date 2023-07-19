window.addEventListener( 'load', () => {
    const types = 'https://pokeapi.co/api/v2/type';
    const endpointPokemons = 'https://pokeapi.co/api/v2/pokemon/'
    const buttons = document.querySelector( '#pagination' )
    renderizarPokemons( endpointPokemons )
    renderizarNombreTipos( types )
    buscador( endpointPokemons )
    buttons.addEventListener( 'click', e => {
            
        if ( e.target.classList.contains( 'btn' ) ) {
            let url = e.target.dataset.url;                
            renderizarPokemons( url )
        }
    } )

    setTimeout(() => {
        const cards = document.querySelectorAll( '.cards' )
        if ( cards.length > 0 ) {
            console.log( "SIII" );
        }
    }, 1000); 

    if ( localStorage.length > 0 ) {
        localStorage.clear()
    }
    console.log(  );
    

    if ( window.innerWidth < 1060 ) {
        filterMedia()
    }
} )

// DATOS 
function renderizarPokemons( endpoint ) {
    const cards = document.querySelector( '#cards' );
    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        // console.log( cards );
        const results = data.results
        const buttons = document.querySelector( '#pagination' )
        const btnNext = data.next ? `<button class="btn" data-url=${data.next}>Siguiente</button>` : ""
        const btnPrevious = data.previous ? `<button class="btn" data-url=${data.previous}>Anterior</button>` : ""
        buttons.innerHTML = `${btnPrevious} ${btnNext}`
        
        cards.innerHTML = ""
        results.forEach( ( result, id ) => {
            id++
            pokemon( result.url, id )
        } )
        verEvoluciones()
    } )
    .catch( error => console.error( error ) )

}

function pokemon( endpoint, id ) {
    
    const cards = document.querySelector( '#cards' );

    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        console.log( "Pokemons" );
        console.log( data );
        const imagen = data.sprites.other.dream_world.front_default;
        const nombrePokemon = data.name
        const types = data.types;
        let tipo = types.map( type => `<p class="card__type">${type.type.name}</p>` )
        tipo = tipo.join( "" );

        cards.innerHTML += `
            <article class="card" id="poke-${id}">
                <div class="card__img">
                    <img class="card__img" src="${imagen}" alt="">
                </div>
                <h5 class="card__name">${nombrePokemon}</h5>
                <div class="card__types">
                    ${tipo}
                </div>
            </article>
        `
    } )
    .catch( error => console.error( error ) )

}

function renderizarPokemonPorBuscador( pokemon ) {
    
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    const cards = document.querySelector( '#cards' );

    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        console.log( data );
        const imagen = data.sprites.other.dream_world.front_default;
        const nombrePokemon = data.name
        const types = data.types;
        let tipo = types.map( type => `<p class="card__type">${type.type.name}</p>` )
        tipo = tipo.join( "" );
        cards.innerHTML = ""
        cards.innerHTML += `
            <div class="card" id="poke-1">
                <div class="card__img">
                    <img class="card__img" src="${imagen}" alt="">
                </div>
                <h5 class="card__name">${nombrePokemon}</h5>
                <div class="card__types">
                    ${tipo}
                </div>
            </div>
        `
        verEvoluciones()
    } )
    .catch( error => console.error( error ) )
}

// BUSCADOR  
function buscador( endpoint ) {
    document.addEventListener( 'keyup', e => {
        if ( e.target.matches( "#search" ) ) {
            const textInput = e.target.value.toLowerCase()
            if ( !textInput ) {
                renderizarPokemons( endpoint )
            }
        }
    } )
    document.addEventListener( 'keypress', e => {
        if ( e.key === 'Enter') {
            if ( e.target.matches( "#search" ) ) {
                const textInput = e.target.value.toLowerCase();
                renderizarPokemonPorBuscador( textInput )
                
            }
        }
    } )
}

function renderizarPokemonPorTipo( name ) {
    const cards = document.querySelector( '#cards' );
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${name}`

    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {

        console.log( data );
        const imagen = data.sprites.other.dream_world;
        const nombrePokemon = data.name
        const types = data.types;

        let tipo = types.map( type => `<p class="card__type">${type.type.name}</p>` )
        tipo = tipo.join( "" );

        if ( imagen?.front_default ) {
            cards.innerHTML += `
            <div class="card">
                <div class="card__img">
                    <img class="card__img" src="${imagen.front_default}" alt="">
                </div>
                <h5 class="card__name">${nombrePokemon}</h5>
                <div class="card__types">
                    ${tipo}
                </div>
            </div>
        `
        }
    } )
    .catch( error => console.error( error ) )
}

function renderizarNombreTipos( endpoint ) {
    
    fetch( endpoint )
    .then( res => {

        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }

        return res.json()
    })
    .then( data => {
        console.log( "TIPOS" );
        console.log( data );
        const results = data.results;
        const types = document.querySelector( '.types' )

        results.forEach( result => {
            if ( result.name != 'unknown' && result.name != 'shadow' ) {
                types.innerHTML += `
                <div class="type">
                    <label class="type__label" for="${result.name}">
                        <input type="radio" id=${result.name} value=${result.name} class="type__input" name="type"></input>
                        ${result.name}
                    </label>
                </div>
                `
            }
        })
        clickInput()
    })
    .catch( error => console.log( error ) )
}

function mostrarTipoDePokemons( nombre ) {

    const endpoint = `https://pokeapi.co/api/v2/type/${nombre}`
    const cards = document.querySelector( '#cards' );

    fetch( endpoint )
    .then( res => {

        if ( !res.ok ) {
            throw new Error( `ERROR HTTP: ${res.status}` )
        }

        return res.json()
    } )
    .then( data => {
        const pokemons = data.pokemon
        cards.innerHTML = ""

        if ( pokemons.length > 0 ) {
            pokemons.forEach( pokemon => {
                const nombre = pokemon.pokemon.name
                renderizarPokemonPorTipo( nombre )
            } )
        } 

    } )
    .catch( error => console.log( error ) )
}

function clickInput() {
    const inputs = document.querySelectorAll( '.type__label input' )
    const endpoint = 'https://pokeapi.co/api/v2/pokemon/'
    let tipoSeleccionado = ""
    inputs.forEach( input => {
        input.addEventListener( 'click', () => {
            tipoSeleccionado = input.value
            if ( input.checked ) {
                clearLabels()
                input.parentElement.classList.add( 'press' )
                mostrarTipoDePokemons( tipoSeleccionado )
                if ( input.getAttribute( 'id' ) == 'verTodos' ) {
                    renderizarPokemons( endpoint )
                }
            }
        } )
        setTimeout( pokemonPorTipo, 10000);
    })
}

function clearLabels() {
    const labels = document.querySelectorAll( '.type__label' )
    labels.forEach( label => {
        label.classList.remove( 'press' )
    } )  
}

function verEvoluciones() {
    
    setTimeout(() => {
        const cards = document.querySelectorAll( '.card' )
        cards.forEach( card => {
            card.addEventListener( 'click', () => {
                const id = card.getAttribute( 'id' );
                const cardName = document.querySelector( `#${id} .card__name` );
                let nombre = cardName.textContent
                localStorage.setItem( "nombre", JSON.stringify( nombre ) ) 
                location.replace( './detalles.html' )
            } )
        } )
    }, 1000);


}

function pokemonPorTipo() {
    const cards = document.querySelectorAll( '.card' )
    cards.forEach( ( card, i ) => {
        i++
        card.setAttribute( 'id', `poke-${i}` )
        verEvoluciones()
    } )
}

function filterMedia() {
    const inputMedia = document.querySelector( '.filter-media__input' )
    const types = document.querySelector( '.types' )
    inputMedia.addEventListener( 'click', () => {
        if ( !inputMedia.checked ) {
            types.style.display = 'none'
        }
        else {
            types.style.display = 'flex'
        }
    } )
}
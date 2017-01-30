"use strict";
import React from "react"
import axios from "axios"
import {observer} from "mobx-react"
import Autosuggest from 'react-autosuggest';

var post;
var r;
var score = 0;
var allArray;
var randomNrs;
var currentPost = 0;
var failed = 0;
var input;
const subreddits = [
    {
        name: "Viljar"
    },
    {
        name: 'Rolfsen'
    }
];
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : subreddits.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};
const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);
function shouldRenderSuggestions() {
    return true;
}
@observer
export default class TodoList extends React.Component {
    constructor() {
        super();
        const dUrl = "https://www.reddit.com/r/all/.json";

        axios.get(`http://www.reddit.com/r/all.json`)
            .then(res => {
                //console.log("ny: ", res.data.data.children[0].data.subreddit);
                allArray = res.data.data.children;
                allArray.forEach(function (element) {
                    subreddits.push({name: element.data.subreddit})
                });
                randomNrs = this.shuffle(allArray.length);
                //console.log("res", res);
                this.newPost();
               // console.log(subreddits);
            });
        this.state = {
            value: '',
            suggestions: []
        };
        this.setState({score: "Score" + score}); // fungerer ikke. Vet ikke helt hvorfor!
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };


    shuffle(length) {
        for (var a = [], i = 0; i < length; ++i) a[i] = i;
        var tmp, current, top = a.length;
        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = a[current];
            a[current] = a[top];
            a[top] = tmp;
        }
        return a;
    }

    newPost() {
        console.log("new post starting");
        this.score = score;
        post = allArray[randomNrs[currentPost]].data;
        currentPost++;
        if (post.post_hint === "image") {
            post.imgUrl = post.url;
        } else {
            if (!(post.thumbnail != "self" && post.thumbnail != "default" && post.thumbnail != "nsfw" && post.thumbnail != "image")) {
                post.imgUrl = "http://zoz.cbk.waw.pl/wp-content/themes/zoz/images/noimg.jpg";

            }
            else {
                post.imgUrl = post.thumbnail;
            }

        }
        //console.log("post", post);
        post.tries = 3;

        this.setState({post: post});
    }

    checkAnswer(e) {
        //console.log("input", this.input);
    
        if(e != null && e.type != null && (e.type === "keydown")) return;
        //console.log("value", e.target.value);

        var guess = this.input.value;
        if (post != null && guess.toLowerCase() === post.subreddit.toLowerCase()) {
            //console.log("HURAY");
            score++;
            this.newPost();

        } else {
            if (post.tries === 1) {
                this.newPost();
                failed++;
            } else {
                post.tries--;
                this.setState({post: post});
            }
        }
        this.setState({
            value: ''
        });

    }

    handleSubmit = (event) => {
        event.preventDefault();
        //console.log("Im here boiii", event);
        this.checkAnswer();

    };

    storeInputReference = autosuggest => {
        if (autosuggest !== null) {
            this.input = autosuggest.input;
           // console.log("ref", this.input);
        }
    };

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Type a subreddit!',
            value,
            onChange: this.onChange
        };
        const outScore = score;
        const post = this.state.post;
        const total = currentPost - 1;
        // this.setProps({score});

        if (!this.state.post) return <h1> LOADING </h1>;
        return <div>
            <h2>{this.state.post.title}</h2>
            <img src={this.state.post.imgUrl}/>
            <br/>
            <br/>
            <form onSubmit={this.handleSubmit}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    ref={this.storeInputReference}
                    onSuggestionSelected={this.checkAnswer.bind(this)}
                />
            </form>
            <h3>Score: {outScore} / {total} </h3>
            <h4>Tries: {post.tries} </h4>
            <button onClick={this.newPost.bind(this)}> New post</button>


        </div>
    }
}
/*

 */
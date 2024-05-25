const n = 20;
let array = [];
let searchType = '';
let animationSpeed = 500; 
let maxBars = 100; 
let minBars = 10; 
let isSorting = false; 
let currentTimeout = null; 

function init() {
    generateArray();
    document.getElementById("message").innerText = "";
    document.getElementById("search-options").style.display = "none";
    document.getElementById("search-input").style.display = "none";
    displayAlgorithmInfo("", "");
    document.querySelectorAll('.sorting-button').forEach(button => {
        button.style.backgroundColor = 'red';
    });
}

function generateArray() {
    array = [];
    for (let i = 0; i < n; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    showBars('blue'); 
}

function toggleSearchOptions() {
    const searchOptions = document.getElementById("search-options");
    searchOptions.style.display = searchOptions.style.display === "none" ? "block" : "none";
}

function requestSearch(type) {
    searchType = type;
    array.sort((a, b) => a - b);
    showBars();
    document.getElementById("search-input").style.display = "block";
    displayAlgorithmInfo(`${capitalizeFirstLetter(type)} Search`, getTimeComplexity(type));
}

function startSearch() {
    const target = parseInt(document.getElementById("search-value").value);
    let moves;

    switch (searchType) {
        case 'binary':
            moves = binarySearch([...array], target);
            break;
        case 'linear':
            moves = linearSearch([...array], target);
            break;
        case 'exponential':
            moves = exponentialSearch([...array], target);
            break;
        default:
            return;
    }

    animateSearch(moves, array, target);
}

function playBubbleSort() {
    if (isSorting) {
        stopSorting();
        return;
    }
    isSorting = true;
    const copy = [...array];
    const start = performance.now();
    const moves = bubbleSort(copy);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(4);
    animateSorting(moves, timeTaken, "Bubble Sort");
    displayAlgorithmInfo("Bubble Sort", "Time Complexity: O(n^2)");
}

function playInsertionSort() {
    if (isSorting) {
        stopSorting();
        return;
    }
    isSorting = true;
    const copy = [...array];
    const start = performance.now();
    const moves = insertionSort(copy);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(4);
    animateSorting(moves, timeTaken, "Insertion Sort");
    displayAlgorithmInfo("Insertion Sort", "Time Complexity: O(n^2)");
}

function playSelectionSort() {
    if (isSorting) {
        stopSorting();
        return;
    }
    isSorting = true;
    const copy = [...array];
    const start = performance.now();
    const moves = selectionSort(copy);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(4);
    animateSorting(moves, timeTaken, "Selection Sort");
    displayAlgorithmInfo("Selection Sort", "Time Complexity: O(n^2)");
}

function playMergeSort() {
    if (isSorting) {
        stopSorting();
        return;
    }
    isSorting = true;
    const copy = [...array];
    const start = performance.now();
    const moves = mergeSort(copy);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(4);
    animateSorting(moves, timeTaken, "Merge Sort");
    displayAlgorithmInfo("Merge Sort", "Time Complexity: O(n log n)");
}

function stopSorting() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    isSorting = false;
    currentTimeout = null;
    displayAlgorithmInfo("", "");
    document.getElementById("message").innerText = "Sorting stopped.";
    document.querySelectorAll('.sorting-button').forEach(button => {
        button.style.backgroundColor = 'red';
    });
}

function showBars(color) {
    const container = d3.select("#container");
    container.selectAll("*").remove();
    container.selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .classed("bar", true)
        .style("height", d => `${d * 3}px`)
        .style("width", `${100 / n}%`)
        .style("background-color", color ? color : "blue") 
        .text(d => d);
}

function displayAlgorithmInfo(name, timeComplexity) {
    const message = document.getElementById("message");
    if (name !== "" && timeComplexity !== "") {
        message.innerHTML = `<div style="background-color: white; padding: 10px;"><strong>${name}</strong><br>${timeComplexity}</div>`;
    } else {
        message.innerHTML = "";
    }
}


function animateSorting(moves, timeTaken, algorithmName) {
    if (!moves.length) {
        isSorting = false;
        showBars('orange'); 
        displayAlgorithmInfo(`${algorithmName} - Time Taken: ${timeTaken} seconds`, "");
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    showBars('red');

    currentTimeout = setTimeout(() => {
        animateSorting(moves, timeTaken, algorithmName);
    }, animationSpeed);
}

function animateSearch(moves, array, target) {
    if (!moves.length) {
        document.getElementById("message").innerText = `Element ${target} not found`;
        return;
    }

    const move = moves.shift();
    const [i] = move.indices;
    const container = d3.select("#container");
    container.selectAll("div")
        .data(array)
        .style("background-color", (d, index) => index === i ? "yellow" : "red");

    if (move.found) {
        document.getElementById("message").innerText = `Element ${target} found at index ${i}`;
        return;
    }

    currentTimeout = setTimeout(() => {
        animateSearch(moves, array, target);
    }, animationSpeed);
}

function getTimeComplexity(type) {
    switch (type) {
        case 'binary':
            return 'Time Complexity: O(log n)';
        case 'linear':
            return 'Time Complexity: O(n)';
        case 'exponential':
            return 'Time Complexity: O(log n)';
            default:
                return '';
        }
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function bubbleSort(array) {
        const moves = [];
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i] > array[i + 1]) {
                    [array[i], array[i + 1]] = [array[i + 1], array[i]];
                    swapped = true;
                    moves.push({ indices: [i, i + 1], type: "swap" });
                }
            }
        } while (swapped);
        return moves;
    }
    
    function insertionSort(array) {
        const moves = [];
        for (let i = 1; i < array.length; i++) {
            let j = i;
            while (j > 0 && array[j] < array[j - 1]) {
                [array[j], array[j - 1]] = [array[j - 1], array[j]];
                moves.push({ indices: [j, j - 1], type: "swap" });
                j--;
            }
        }
        return moves;
    }
    
    function selectionSort(array) {
        const moves = [];
        for (let i = 0; i < array.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                moves.push({ indices: [i, minIndex], type: "swap" });
            }
        }
        return moves;
    }
    function mergeSort(array) {
        const moves = [];
        function merge(arr, l, m, r) {
            const n1 = m - l + 1;
            const n2 = r - m;
            const L = new Array(n1);
            const R = new Array(n2);
    
            for (let i = 0; i < n1; i++)
                L[i] = arr[l + i];
            for (let j = 0; j < n2; j++)
                R[j] = arr[m + 1 + j];
    
            let i = 0;
            let j = 0;
            let k = l;
    
            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                k++;
            }
    
            while (i < n1) {
                arr[k] = L[i];
                i++;
                k++;
            }
    
            while (j < n2) {
                arr[k] = R[j];
                j++;
                k++;
            }
        }
    
        function mergeSortHelper(arr, l, r) {
            if (l >= r) {
                return;
            }
            const m = l + Math.floor((r - l) / 2);
            mergeSortHelper(arr, l, m);
            mergeSortHelper(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    
        mergeSortHelper(array, 0, array.length - 1);
        return moves;
    }
    
    
    function linearSearch(array, target) {
        const moves = [];
        for (let i = 0; i < array.length; i++) {
            moves.push({ indices: [i], found: false });
            if (array[i] === target) {
                moves[moves.length - 1].found = true;
                break;
            }
        }
        return moves;
    }
    
    function binarySearch(array, target) {
        const moves = [];
        let left = 0;
        let right = array.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            moves.push({ indices: [mid], found: false });
            if (array[mid] === target) {
                moves[moves.length - 1].found = true;
                break;
            } else if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return moves;
    }
    
    function exponentialSearch(array, target) {
        const moves = [];
        if (array[0] === target) {
            moves.push({ indices: [0], found: true });
            return moves;
        }
        let i = 1;
        while (i < array.length && array[i] <= target) {
            moves.push({ indices: [i], found: false });
            i *= 2;
        }
        return binarySearch(array.slice(Math.floor(i / 2), Math.min(i, array.length)), target).map(move => ({
            indices: [move.indices[0] + Math.floor(i / 2)],
            found: move.found
        }));
    }
    
    init();

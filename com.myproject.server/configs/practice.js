// let arr1 = [10, 20, 30]
// let arr2 = [...arr1];
// console.log(arr2);

// console.log(
//     ["Angular", "Mongodb", "Express", "Node"].find((element, index) => {
//         return element === "Angular";
//     }),

// )
// let arr1 = [10, 41, 23, 64, 19];
// console.log(
//     arr1.sort((num1, num2) => {
//         return num1 - num2;
//     })
// )
// let arr = [10, 41, 23, 64, 19];
// console.log(
//     arr.sort((num1, num2) => {
//         return num2 - num1
//     })[1]
// )

// console.log(
//         Array.from("Shambhu").reverse().join(" ")

//     )
console.log(
    ["Shambhu", "Vedmati", "Chanda", "Anjali"].map((element, index) => {
        return Array.from(element).reverse().toString()
    })
)
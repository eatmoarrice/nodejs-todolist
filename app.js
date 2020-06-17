const fs = require("fs");
const chalk = require("chalk");
const yargs = require("yargs");

function loadData() {
	try {
		const buffer = fs.readFileSync("data.json"); // read file to buffer/binary data
		const data = buffer.toString(); //convert to string
		return JSON.parse(data); //convert to JSON
	} catch (err) {
		return [];
	}
}

function listTodo(data, text) {
	if (data.length > 0) {
		console.log(chalk.green.underline.bold(`Your ${text} todo list is:`));
		console.log("");
		data.map((item) => {
			console.log("|" + chalk.bold.yellow("ID: ") + chalk.red(item.id));
			console.log("|------------------------------");
			console.log("|" + chalk.bold.yellow("To do: ") + chalk.green(item.todo));
			console.log("|------------------------------");
			if (item.complete) {
				console.log("|" + chalk.bold.yellow("Status: ") + chalk.green("complete"));
			} else {
				console.log("|" + chalk.bold.yellow("Status: ") + chalk.red("incomplete"));
			}
			console.log("|______________________________");
			console.log("");
		});
	} else {
		console.log(chalk.green.underline.bold(`Your todo list is empty.`));
	}
}

function saveData(data) {
	fs.writeFileSync("data.json", JSON.stringify(data));
	listTodo(data, "new");
}

function addTodo(id, todo, status) {
	const data = loadData();
	const newTodo = { id: id, todo: todo, complete: status };
	data.push(newTodo);
	saveData(data);
}

yargs.command({
	command: "list",
	describe: "Listing all todos",
	handler: function () {
		console.log(chalk.green.bold("Listing todos"));
		const data = loadData();
		listTodo(data, "full");
	}
});

yargs.command({
	command: "list_complete",
	describe: "Listing all completed todos",
	handler: function (args) {
		let data = loadData();
		data = data.filter((item) => {
			if (item.complete) {
				return item;
			}
		});
		listTodo(data, "completed");
	}
});

yargs.command({
	command: "list_incomplete",
	describe: "Listing all completed todos",
	handler: function (args) {
		let data = loadData();
		data = data.filter((item) => {
			if (!item.complete) {
				return item;
			}
		});
		listTodo(data, "incomplete");
	}
});

yargs.command({
	command: "delete",
	describe: "Delete Todo with a specific ID",
	handler: function (args) {
		const id = args._[1];
		const data = loadData();
		const index = data.findIndex((item) => (item.id = id));
		data.splice(index - 1, 1);
		saveData(data);
	}
});

yargs.command({
	command: "toggle",
	describe: "Toggle the complete state of a specific Todo",
	handler: function (args) {
		const id = args._[1];
		const data = loadData();
		data[id].complete = !data[id].complete;
		saveData(data);
	}
});

yargs.command({
	command: "delete_all",
	describe: "Delete everything",
	handler: function (args) {
		saveData([]);
	}
});

yargs.command({
	command: "delete_completed",
	describe: "Delete all completed tasks",
	handler: function (args) {
		let data = loadData();
		console.log(data);
		let data2 = data.filter((item) => {
			if (item.complete === false) return item;
		});

		saveData(data);
	}
});

yargs.command({
	command: "add",
	describe: "add a new todo",
	builder: {
		todo: {
			describe: "todo content",
			demandOption: true,
			type: "string",
			alias: "t"
		},
		complete: {
			describe: "status of your todo",
			demandOption: false,
			default: false,
			type: "boolean",
			alias: "s"
		}
	},
	handler: function (arg) {
		let array = loadData();
		let id = 0;
		if (array.length != 0) {
			id = array[array.length - 1].id;
		}
		addTodo(id + 1, arg.todo, arg.complete);
	}
});

yargs.parse();

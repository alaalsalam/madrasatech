class Quiz {
	constructor(wrapper, options) {
		this.wrapper = wrapper;
		Object.assign(this, options);
		this.questions = []
		this.refresh();
	}

	refresh() {
		this.get_quiz();
	}

	get_quiz() {
		frappe.call('education.education.utils.get_quiz', {
			quiz_name: this.name,
			course: this.course
		}).then(res => {
			this.make(res.message)
		});
	}

	make(data) {
		if (data.is_time_bound) {
			$(".lms-timer").removeClass("hide");
			if (!data.activity || (data.activity && !data.activity.is_complete)) {
				this.initialiseTimer(data.duration);
				this.is_time_bound = true;
				this.time_taken = 0;
			}
		}
		data.questions.forEach(question_data => {
			let question_wrapper = document.createElement('div');
			let question = new Question({
				wrapper: question_wrapper,
				...question_data
			});
			this.questions.push(question)
			this.wrapper.appendChild(question_wrapper);
		})
		if (data.activity && data.activity.is_complete) {
			this.disable()
			let indicator = 'red'
			let message = 'Your are not allowed to attempt the quiz again.'
			if (data.activity.result == 'Pass') {
				indicator = 'green'
				message = 'You have already cleared the quiz.'
			}
			if (data.activity.time_taken) {
				this.calculate_and_display_time(data.activity.time_taken, "Time Taken - ");
			}
			this.set_quiz_footer(message, indicator, data.activity.score)
		}
		else {
			this.make_actions();
		}
		window.addEventListener('beforeunload', (event) => {
			event.preventDefault();
			event.returnValue = '';
		});
	}

	initialiseTimer(duration) {
		this.time_left = duration;
		var self = this;
		var old_diff;
		this.calculate_and_display_time(this.time_left, "Time Left - ");
		this.start_time = new Date().getTime();
		this.timer = setInterval(function () {
			var diff = (new Date().getTime() - self.start_time)/1000;
			var variation = old_diff ? diff - old_diff : diff;
			old_diff = diff;
			self.time_left -= variation;
			self.time_taken += variation;
			self.calculate_and_display_time(self.time_left, "Time Left - ");
			if (self.time_left <= 0) {
				clearInterval(self.timer);
				self.time_taken -= 1;
				self.submit();
			}
		}, 1000);
	}

	calculate_and_display_time(second, text) {
		var timer_display = document.getElementsByClassName("lms-timer")[0];
		var hours = this.append_zero(Math.floor(second / 3600));
		var minutes = this.append_zero(Math.floor(second % 3600 / 60));
		var seconds = this.append_zero(Math.ceil(second % 3600 % 60));
		timer_display.innerText = text + hours + ":" + minutes + ":" + seconds;
	}

	append_zero(time) {
		return time > 9 ? time : "0" + time;
	}

	make_actions() {
		const button = document.createElement("button");
		button.classList.add("btn", "btn-primary", "mt-5", "mr-2");

		button.id = 'submit-button';
		button.innerText = 'Submit';
		button.onclick = () => this.submit();
		this.submit_btn = button
		this.wrapper.appendChild(button);
	}

	submit() {
		if (this.is_time_bound) {
			clearInterval(this.timer);
			$(".lms-timer").text("");
		}
		this.submit_btn.innerText = 'Evaluating..'
		this.submit_btn.disabled = true
		this.disable()
		frappe.call('education.education.utils.evaluate_quiz', {
			quiz_name: this.name,
			quiz_response: this.get_selected(),
			course: this.course,
			program: this.program,
			time_taken: this.is_time_bound ? this.time_taken : 0
		}).then(res => {
			this.submit_btn.remove()
			if (!res.message) {
				frappe.throw(__("Something went wrong while evaluating the quiz."))
			}

			let indicator = 'red'
			let message = 'Fail'
			if (res.message.status == 'Pass') {
				indicator = 'green'
				message = 'Congratulations, you cleared the quiz.'
			}

			this.set_quiz_footer(message, indicator, res.message.score)
		});
	}

	set_quiz_footer(message, indicator, score) {
		const div = document.createElement("div");
		div.classList.add("mt-5");
		div.innerHTML = `<div class="row">
							<div class="col-md-8">
								<h4>${message}</h4>
								<h5 class="text-muted"><span class="indicator ${indicator}">Score: ${score}/100</span></h5>
							</div>
							<div class="col-md-4">
								<a href="${this.next_url}" class="btn btn-primary pull-right">${this.quiz_exit_button}</a>
							</div>
						</div>`

		this.wrapper.appendChild(div)
	}

	disable() {
		this.questions.forEach(que => que.disable())
	}

	get_selected() {
		let que = {}
		this.questions.forEach(question => {
			que[question.name] = question.get_selected()
		})
		return que
	}
}

class Question {
	constructor(opts) {
		Object.assign(this, opts);
		this.make();
	}

	make() {
		this.make_question()
		this.make_options()
	}

	get_selected() {
		let selected = this.options.filter(opt => opt.input.checked)
		if (this.type == 'Single Correct Answer') {
			if (selected[0]) return selected[0].name
		}
		if (this.type == 'Multiple Correct Answer') {
			return selected.map(opt => opt.name)
		}
		return null
	}

	disable() {
		let selected = this.options.forEach(opt => opt.input.disabled = true)
	}

	make_question() {
		let question_wrapper = document.createElement('h5');
		question_wrapper.classList.add('mt-3');
		question_wrapper.innerHTML = this.question;
		this.wrapper.appendChild(question_wrapper);
	}

	make_options() {
		let make_input = (name, value) => {
			let input = document.createElement('input');
			input.id = name;
			input.name = this.name;
			input.value = value;
			input.type = 'radio';
			if (this.type == 'Multiple Correct Answer')
				input.type = 'checkbox';
			input.classList.add('form-check-input');
			return input;
		}

		let make_label = function (name, value) {
			let label = document.createElement('label');
			label.classList.add('form-check-label');
			label.htmlFor = name;
			label.innerText = value;
			return label
		}

		let make_option = function (wrapper, option) {
			let option_div = document.createElement('div');
			option_div.classList.add('form-check', 'pb-1');
			let input = make_input(option.name, option.option);
			let label = make_label(option.name, option.option);
			option_div.appendChild(input);
			option_div.appendChild(label);
			wrapper.appendChild(option_div);
			return { input: input, ...option };
		}

		let options_wrapper = document.createElement('div')
		options_wrapper.classList.add('ml-2')
		let option_list = []
		this.options.forEach(opt => option_list.push(make_option(options_wrapper, opt)))
		this.options = option_list
		this.wrapper.appendChild(options_wrapper)
	}
}

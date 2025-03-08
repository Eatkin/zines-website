from functools import wraps
import random
from flask import render_template
from common import EMOJIS

def inject_emojis(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        before_emoji = random.choice(EMOJIS)
        after_emoji = random.choice(EMOJIS)
        # Ensure that the emojis are different
        while after_emoji == before_emoji:
            after_emoji = random.choice(EMOJIS)

        # Get the original template and context
        response = view_function(*args, **kwargs)

        # If the response is a call to render_template, inject emojis
        if isinstance(response, tuple) and len(response) == 2:
            template_name, context = response
            context["before_emoji"] = before_emoji
            context["after_emoji"] = after_emoji
            return render_template(template_name, **context)

        return response  # If it's something else, just return it normally

    return decorated_function

import cProfile
import functools
import time
from typing import Callable

from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


def profile_and_log(func: Callable):
    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs):
        log.info(f"Starting {func.__name__} with args={args}, kwargs={kwargs}")

        profiler = cProfile.Profile()
        profiler.enable()

        start_time = time.time()

        try:
            result = await func(self, *args, **kwargs)
        except Exception as e:
            log.error(f"Error occurred while executing {func.__name__}: {e}")
            raise
        finally:
            profiler.disable()
            profiler.dump_stats(f"{func.__name__}_profile_results.prof")

            elapsed_time = time.time() - start_time
            log.info(f"Execution time of {func.__name__}: {elapsed_time:.4f} seconds")

        return result

    return wrapper

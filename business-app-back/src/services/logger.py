import os

import logging
from logging import Formatter, Logger, StreamHandler


class LoggerProvider:
    """
    Вспомогательный класс для получения логгера.
    Применяет базовые настройки к встроенному логгеру и
    возвращает инстранцию логгера с указанным названием.
    """

    def __init__(self):
        linear_formatter = Formatter(
            "%(asctime)s: %(levelname)s [%(threadName)s] %(funcName)s(%(lineno)d): %(message)s", "%Y-%m-%d %H:%M:%S"
        )

        self.console_handler = StreamHandler()
        self.console_handler.setFormatter(linear_formatter)

    def get_logger(self, name: str) -> Logger:
        logger = Logger(name)
        logger.setLevel(logging.INFO)
        if self.console_handler not in logger.handlers:
            logger.addHandler(self.console_handler)

        return logger


def tail(file_path: str, lines: int) -> list:
    """
    Возвращает последние строки из файла.
    :param file_path: Путь к файлу.
    :param lines: Количество строк, которые нужно получить с конца файла.
    :return: Список строк из файла.
    """
    with open(file_path, "rb") as file:
        file.seek(0, os.SEEK_END)
        buffer = bytearray()
        pointer_location = file.tell()

        while pointer_location >= 0 and lines > 0:
            file.seek(pointer_location)
            pointer_location -= 1
            new_byte = file.read(1)

            if new_byte == b"\n" and buffer:
                lines -= 1
                if lines == 0:
                    break

            buffer.extend(new_byte)

        if not buffer:
            return []

        return buffer.decode("utf-8", errors="ignore")[::-1].splitlines()[::-1]

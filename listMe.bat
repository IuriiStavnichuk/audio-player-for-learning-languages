chcp 1251
SET TMP_FILE="%TEMP%\lst.txt"
del %TMP_FILE%
dir %1 > /a:-d /b > %TMP_FILE%
notepad %TMP_FILE%
UPDATE Tasks
SET status = 'Complete' --original was pending, refer to INSERT statement
WHERE id = 1;

SELECT * FROM Tasks
order by id
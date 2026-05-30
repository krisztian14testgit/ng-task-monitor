# QA Testing Plan — ng-task-monitor
> **AI Agent Instructions**: Follow every section in order. Each test step is a numbered instruction. Record each result as **PASS**, **FAIL**, or **NOTE**. After completing all sections, summarize findings.

---

## Environment Setup

### Start the Application
1. Open a terminal in the project root (`ng-task-monitor/`).
2. Run: `npm run start`
3. Wait until the console shows: `** Angular Live Development Server is listening on localhost:4200 ...`
4. Open `http://localhost:4200` in the browser (VS Code Simple Browser or external browser).
5. **Verify**: The page loads and automatically redirects to `/tasks/all`.
6. **Verify**: The header shows the title **"All tasks"**.
7. **Verify**: A **"Menu"** button and an **"Options"** button are visible in the top-right area of the header.

---

## Section 1 — Navigation & Header

### 1.1 App Menu
1. Click the **"Menu"** button in the header.
2. **Verify**: A dropdown panel appears with two groups: **Tasks** and **Charts**.
3. Under **Tasks**, verify two items are present: `All tasks` (📋 icon) and `Finished` (✅ icon).
4. Under **Charts**, verify two items are present: `Daily` (🍩 icon) and `In-Weekly` (📈 icon).
5. Click **"All tasks"** → **Verify**: URL becomes `/tasks/all`, header title changes to "All tasks".
6. Click **"Menu"** → click **"Finished"** → **Verify**: URL becomes `/tasks/finished`, header title changes to "Finished".
7. Click **"Menu"** → click **"Daily"** → **Verify**: URL becomes `/statistic/daily`, header title changes to "Daily".
8. Click **"Menu"** → click **"In-Weekly"** → **Verify**: URL becomes `/statistic/weekly`, header title changes to "In-Weekly".

### 1.2 Options Menu
1. Click the **"Options"** button in the header.
2. **Verify**: A dropdown panel appears with two groups: **Themes** and **Location**.
3. Under **Themes**, verify four radio buttons are visible: `Light`, `Dark`, `BlueDragon`, `firePhoenix`.
4. Under **Location**, verify one link is present: `Change location`.
5. Click **"Change location"** → **Verify**: URL becomes `/location`, header title changes to "Change location".

### 1.3 Unknown Route (404)
1. Manually type `http://localhost:4200/unknown-path` in the browser address bar.
2. **Verify**: A "Page Not Found" message or component is displayed.
3. Navigate back to `/tasks/all` using the Menu.

---

## Section 2 — Task Page: Creating 10 Tasks

> Navigate to `/tasks/all` before starting this section.
> Each new task opens an **editable card** (edit mode) automatically.
> Tasks are created with different planned times (in minutes). Use the values specified per task.

### Pre-condition Check
1. **Verify**: The task counter reads `0/10` (or shows the current count if tasks already exist).
2. **Verify**: The **"+ New task"** button is visible.

### 2.1 Create Task #1 — Valid, Short Timer
1. Click **"+ New task"**.
2. **Verify**: A new editable card appears at the top of the list with an empty title input, description textarea, and planned time input.
3. In **Task Title** input: type `Task-Alpha`.
4. In **Description** textarea: type `First test task with a short timer.`
5. In **Planned time (min)** input: type `5`.
6. Click **"Save"**.
7. **Verify**: The card closes edit mode and displays `Task-Alpha`, description text, `Planed time(min): 5`.
8. **Verify**: Timer button shows label text (e.g. `Start`).
9. **Verify**: A green success alert appears: **"Saving has been success!"**

### 2.2 Create Task #2 — Valid, Medium Timer
1. Click **"+ New task"**.
2. Title: `Task-Beta`
3. Description: `Second task, medium duration.`
4. Planned time: `15`
5. Click **"Save"**.
6. **Verify**: Card saved with `Task-Beta`, time `15`.

### 2.3 Create Task #3 — Valid, Longer Timer
1. Click **"+ New task"**.
2. Title: `Task-Gamma`
3. Description: `Third task, longer timer.`
4. Planned time: `30`
5. Click **"Save"**.
6. **Verify**: Card saved with `Task-Gamma`, time `30`.

### 2.4 Create Task #4 — Valid, Zero Timer
1. Click **"+ New task"**.
2. Title: `Task-Delta`
3. Description: `Task with zero planned time.`
4. Planned time: `0`
5. Click **"Save"**.
6. **Verify**: Card saved with `Task-Delta`, time `0`.
7. **Verify**: The timer button is **disabled** (a task with 0 minutes cannot be started).

### 2.5 Create Task #5 — Valid, Max-range Timer
1. Click **"+ New task"**.
2. Title: `Task-Epsilon`
3. Description: `Task at max timer boundary.`
4. Planned time: `1438`
5. Click **"Save"**.
6. **Verify**: Card saved with `Task-Epsilon`, time `1438`.

### 2.6 Create Task #6 — Valid, Underscore Name
1. Click **"+ New task"**.
2. Title: `my_task_06`
3. Description: `Task six uses underscore naming.`
4. Planned time: `10`
5. Click **"Save"**.
6. **Verify**: Card saved successfully.

### 2.7 Create Task #7 — Valid, Hyphen Name
1. Click **"+ New task"**.
2. Title: `feature-task-7`
3. Description: `Task seven uses hyphen naming.`
4. Planned time: `20`
5. Click **"Save"**.
6. **Verify**: Card saved successfully.

### 2.8 Create Task #8 — Valid, Mixed Alphanumeric
1. Click **"+ New task"**.
2. Title: `Sprint01Task`
3. Description: `Task eight mixed name.`
4. Planned time: `45`
5. Click **"Save"**.
6. **Verify**: Card saved successfully.

### 2.9 Create Task #9 — Valid, Short Description
1. Click **"+ New task"**.
2. Title: `QuickCheck`
3. Description: `Short.`
4. Planned time: `3`
5. Click **"Save"**.
6. **Verify**: Card saved successfully.

### 2.10 Create Task #10 — Valid, No Description
1. Click **"+ New task"**.
2. Title: `SilentTask`
3. Description: *(leave empty)*
4. Planned time: `60`
5. Click **"Save"**.
6. **Verify**: Card saved successfully with no description text visible.

### 2.11 Verify Max Limit
1. **Verify**: Task counter now reads `10/10`.
2. Click **"+ New task"** once more.
3. **Verify**: A **yellow warning alert** appears: `"You cannot add news task, max: 10!"`.
4. **Verify**: No new card is added to the list.

---

## Section 3 — Task Page: Editing Non-Started Tasks

> Edit tasks that have **Start** status (not yet activated).
> A task in **Start** status is one whose timer has not been started.

### 3.1 Edit Task-Alpha (change time)
1. Click on the **Task-Alpha** card to select it.
2. **Verify**: An **"edit"** label/button appears on the card title bar.
3. Click **"edit"**.
4. **Verify**: The card enters edit mode (title input, description textarea, time input, Save button visible).
5. Clear the **Planned time** field and type `8`.
6. Click **"Save"**.
7. **Verify**: Card shows `Planed time(min): 8`.
8. **Verify**: Success alert appears.

### 3.2 Edit Task-Beta (change title and description)
1. Click on the **Task-Beta** card.
2. Click **"edit"**.
3. Change title to `Task-Beta-Updated`.
4. Change description to `Updated description for beta task.`
5. Click **"Save"**.
6. **Verify**: Card shows the updated title `Task-Beta-Updated`.

### 3.3 Edit Task-Gamma (change time to mid-range)
1. Click on the **Task-Gamma** card.
2. Click **"edit"**.
3. Change **Planned time** to `25`.
4. Click **"Save"**.
5. **Verify**: Card shows `Planed time(min): 25`.

### 3.4 Edit Task-Delta (change from 0 to active time)
1. Click on the **Task-Delta** card.
2. Click **"edit"**.
3. Change **Planned time** to `12`.
4. Click **"Save"**.
5. **Verify**: Card now shows time `12` and the **Start** timer button is now **enabled**.

### 3.5 Close Without Saving (discard)
1. Click **"+ New task"** to create a new unsaved card.
2. **Verify**: A new editable card appears.
3. Type `Temp-Task` in the title field.
4. Click the **"close"** button on the card (top-right of the edit card).
5. **Verify**: The card disappears from the list without saving.
6. **Verify**: Task counter decreases back (or stays at 10 if we're at the limit — in that case verify warning appeared instead and close was attempted on a different card).

---

## Section 4 — Task Page: Activating Tasks (InProgress)

> Start the countdown timer on several tasks to transition them to **InProgress** status.
> A task must have planned time > 0 and be in the Today period to be startable.

### 4.1 Start Task-Alpha Timer
1. Locate the **Task-Alpha** card (time: `8` min).
2. **Verify**: A **Start** button is visible and **enabled** in the task actions area.
3. Click **"Start"** on Task-Alpha.
4. **Verify**: The button label disappears and is replaced by a **status label** (e.g. `Inprogress`).
5. **Verify**: A countdown timer **HH:mm:ss** appears and is counting down.
6. **Verify**: A **progress bar** appears below the timer and shows decreasing progress.
7. **Verify**: The task card is now **readonly** — the "edit" button no longer appears when clicking the card.

### 4.2 Start Task-Beta-Updated Timer
1. Locate the **Task-Beta-Updated** card (time: `15` min).
2. Click **"Start"**.
3. **Verify**: Countdown timer starts running on this card.
4. **Verify**: Both Task-Alpha and Task-Beta-Updated show simultaneous countdown timers.

### 4.3 Start Task-Delta Timer
1. Locate **Task-Delta** card (time: `12` min after edit in Section 3.4).
2. Click **"Start"**.
3. **Verify**: Countdown timer starts on Task-Delta.

### 4.4 Verify InProgress Status in Filter
1. In the **"Select Task status!"** dropdown, select `inprogress`.
2. **Verify**: Only tasks with InProgress status are shown (Task-Alpha, Task-Beta-Updated, Task-Delta).
3. **Verify**: Each visible task shows a running countdown timer.
4. Reset the status filter to **"All"**.

### 4.5 Wait for a Short Task to Complete (Optional — if time allows)
> *This step requires waiting. Skip to the next section if time is limited, as Task-Alpha has an 8-minute timer.*
1. Observe Task-Alpha's countdown timer approaching `00:00:00`.
2. **Verify**: When the timer reaches zero, the status changes to **Completed**.
3. **Verify**: The countdown timer disappears from Task-Alpha's card.
4. **Verify**: The progress bar disappears.

---

## Section 5 — Task Page: Form Validation Testing

> Each validation test uses the "+ New task" workflow.
> After each invalid input test, close/cancel the card before proceeding to the next test.

### 5.1 Title — Too Short (less than 3 characters)
1. Click **"+ New task"**.
2. Click on the **Task Title** input.
3. Type `ab` (2 characters).
4. Click somewhere else (blur the input) or attempt to type in another field.
5. **Verify**: A red error message appears: `"Min letters: 3 to 30. Please use these letter: 0-9, a-z, -,_!"`.
6. **Verify**: The **Save** button is **disabled**.
7. Click **"close"** to discard.

### 5.2 Title — Starts with a Digit (invalid first char)
1. Click **"+ New task"**.
2. In **Task Title**, type `1invalid-task`.
3. Blur the field.
4. **Verify**: Red error message appears.
5. **Verify**: Save button is disabled.
6. Click **"close"**.

### 5.3 Title — Starts with Hyphen (invalid first char)
1. Click **"+ New task"**.
2. In **Task Title**, type `-invalid-task`.
3. Blur the field.
4. **Verify**: Red error message appears (title cannot start with `-`).
5. **Verify**: Save button is disabled.
6. Click **"close"**.

### 5.4 Title — Too Long (more than 30 characters)
1. Click **"+ New task"**.
2. In **Task Title**, type `ThisIsAVeryLongTaskNameThatExceedsMaxLength`.
3. Blur the field.
4. **Verify**: Red error message appears.
5. **Verify**: Save button is disabled.
6. Click **"close"**.

### 5.5 Title — Valid Minimum Length (3 characters)
1. Click **"+ New task"**.
2. In **Task Title**, type `abc`.
3. Blur the field.
4. **Verify**: No error message appears (or the green border is shown if the input is valid).
5. Click **"close"**.

### 5.6 Planned Time — Negative Number (below minimum 0)
1. Click **"+ New task"**.
2. In **Task Title**, type `ValidTask1`.
3. In **Planned time** input, type `-5`.
4. Blur the field.
5. **Verify**: A red error message appears: `"It's range [0, 1438] in minutes!"`.
6. **Verify**: Save button is disabled.
7. Click **"close"**.

### 5.7 Planned Time — Above Maximum (greater than 1438)
1. Click **"+ New task"**.
2. In **Task Title**, type `ValidTask2`.
3. In **Planned time** input, type `1500`.
4. Blur the field.
5. **Verify**: Red error message appears with range constraint.
6. **Verify**: Save button is disabled.
7. Click **"close"**.

### 5.8 Planned Time — Empty (required field)
1. Click **"+ New task"**.
2. In **Task Title**, type `ValidTask3`.
3. Click on the **Planned time** input and then clear it (if it has a value), then blur.
4. **Verify**: Red error message appears (field is required).
5. **Verify**: Save button is disabled.
6. Click **"close"**.

### 5.9 Both Fields Valid — Save Enabled
1. Click **"+ New task"**.
2. In **Task Title**, type `Valid-Task-99`.
3. In **Planned time**, type `10`.
4. **Verify**: No error messages are shown.
5. **Verify**: The **Save** button is **enabled**.
6. Click **"close"** to discard (not saving, just verifying button state).

---

## Section 6 — Task Page: Filter Testing

> Navigate to `/tasks/all`. Ensure you have multiple tasks with different statuses (Start, InProgress, Completed).
> If tasks from Section 4 are still InProgress, they will be used here.

### 6.1 Status Filter — Filter by "start"
1. In the **"Select Task status!"** dropdown, select `start`.
2. **Verify**: Only tasks with **Start** status are shown.
3. **Verify**: InProgress tasks are **not** visible.
4. **Verify**: The task count reflects the filtered number.

### 6.2 Status Filter — Filter by "inprogress"
1. In the status dropdown, select `inprogress`.
2. **Verify**: Only tasks with **InProgress** status are shown.
3. **Verify**: Running countdown timers are visible on each shown card.

### 6.3 Status Filter — Filter by "completed"
1. In the status dropdown, select `completed`.
2. **Verify**: Only tasks with **Completed** status are shown (timer finished or naturally completed).
3. **Verify**: No countdown timers are visible (completed tasks have no active timer).

### 6.4 Status Filter — Show All
1. In the status dropdown, select `All`.
2. **Verify**: All tasks are shown regardless of status.
3. **Verify**: Task count matches the total number of created tasks.

### 6.5 Time Period Filter — Yesterday
1. In the **"Time period:"** dropdown, select `Yesterday`.
2. **Verify**: Tasks created today are **not** visible.
3. **Verify**: The **"+ New task"** button is **not visible** (adding tasks is disabled for past dates).
4. **Verify**: All visible task cards are **locked** (clicking a card does not show the "edit" button).
5. **Note**: Record how many tasks (if any) were created yesterday.

### 6.6 Time Period Filter — Week
1. In the **Time period** dropdown, select `Week`.
2. **Verify**: All tasks from the entire current week are shown.
3. **Verify**: The **"+ New task"** button is **not visible** (adding tasks is disabled for week view).
4. **Verify**: All visible task cards are **locked** (readonly).

### 6.7 Time Period Filter — Back to Today
1. In the **Time period** dropdown, select `Today`.
2. **Verify**: Only today's tasks are shown.
3. **Verify**: The **"+ New task"** button reappears (if not at limit).
4. **Verify**: Tasks are **editable** again (Start/edit button visible on non-InProgress tasks).

### 6.8 Combined Filter — Period + Status
1. Ensure the Time period is set to `Today`.
2. In the status dropdown, select `start`.
3. **Verify**: Only tasks that are (a) created today AND (b) have Start status are shown.
4. Switch status to `inprogress`.
5. **Verify**: Only tasks that are (a) created today AND (b) InProgress are shown.
6. Reset both filters: Time period → `Today`, Status → `All`.

### 6.9 Finished Tasks Route
1. Click **"Menu"** → click **"Finished"**.
2. **Verify**: URL changes to `/tasks/finished`.
3. **Verify**: The status filter is pre-selected to `completed`.
4. **Verify**: Only completed tasks are shown.

---

## Section 7 — Location Page: Changing Paths

> Navigate to the Location page via **Options → Change location** (URL: `/location`).

### 7.1 Initial State
1. **Verify**: The page shows two cards:
   - Card 1: **"Where would you like to store data?"** with a "Task folder path" input.
   - Card 2: **"Where would you like to store App settings?"** with a "Default app folder" input.
2. **Note**: Record the current values pre-filled in both inputs (existing saved paths).

### 7.2 Invalid Paths — Task Folder Path Input

For each invalid path below, enter it in the **Task folder path** input, then press Tab (blur) or type a character, then record the validation result:

| # | Invalid Input | Reason |
|---|--------------|--------|
| A | `C:\Windows\System32\` | Backslashes not valid |
| B | `/folder/no-drive/` | Missing drive letter format |
| C | `http://some-server/path/` | Protocol prefix not valid |
| D | `C:/no-trailing-slash` | Missing trailing slash |
| E | `c:/lowercase-drive/` | Lowercase drive letter not accepted |
| F | `C:/invalid@chars/` | Special char `@` not allowed |
| G | `123-invalid` | No drive letter or colon |
| H | *(empty — clear the field)* | Required field |

For **each** invalid input:
1. Clear the input field.
2. Type the invalid path.
3. Blur the field (click elsewhere or press Tab).
4. **Verify**: A red error message appears: `"Please enter a valid path! E.g.: C:/folder/..."`.
5. **Verify**: The input field does NOT have a green/valid style.
6. **Record Result** as: FAIL — validation correctly rejected `[path]`.

### 7.3 Valid Paths — Task Folder Path Input

For each valid path below, enter it in the **Task folder path** input and verify acceptance:

| # | Valid Input | Expected Outcome |
|---|------------|-----------------|
| 1 | `C:/users/documents/` | Accepted — saves successfully |
| 2 | `D:/my-folder/tasks/` | Accepted — saves successfully |
| 3 | `C:/Users/userName/Documents/` | Accepted — saves successfully |
| 4 | `C:/test_folder/sub-folder/` | Accepted — saves successfully |
| 5 | `Z:/data/` | Accepted — saves successfully |
| 6 | `C:/folder with spaces/sub/` | Accepted — spaces allowed in segment |

For **each** valid input:
1. Clear the input field.
2. Type the valid path.
3. Press Tab or type another character to trigger validation.
4. **Verify**: No red error message appears.
5. **Verify**: The input field gets a green border/valid style indicator.
6. **Verify**: After a short moment, a **green success alert** appears: `"Path is saved!"`.
7. **Record Result** as: PASS — path `[path]` accepted and saved.

### 7.4 Valid Paths — App Setting Path Input

Repeat steps from **7.3** but for the **Default app folder** (App Settings) input, using:

| # | Valid Input |
|---|------------|
| 1 | `C:/app-settings/` |
| 2 | `D:/config/app-data/` |
| 3 | `C:/Users/userName/AppData/` |

For each:
1. Enter path in the **App Setting** input.
2. Blur the field.
3. **Verify**: No error message.
4. **Verify**: Green border visible.
5. **Verify**: Success alert: `"Path is saved!"`.
6. **Record Result** as: PASS or FAIL.

### 7.5 Enter Key Save Behavior
1. Clear the **Task folder path** input.
2. Type a valid path: `C:/enter-key-test/`.
3. Press **Enter** (do not click elsewhere first).
4. **Verify**: The path is saved and a success alert appears.
5. **Record Result**: PASS if saved, FAIL if not.

### 7.6 Path Validation Summary
After completing 7.2 and 7.3, compile a summary table:

```
Paths that PASSED validation (accepted):
- C:/users/documents/
- D:/my-folder/tasks/
- C:/Users/userName/Documents/
- C:/test_folder/sub-folder/
- Z:/data/
- C:/folder with spaces/sub/
- C:/app-settings/
- D:/config/app-data/
- C:/Users/userName/AppData/
- C:/enter-key-test/

Paths that FAILED validation (rejected — correct behavior):
- C:\Windows\System32\      (backslashes)
- /folder/no-drive/         (no drive format)
- http://some-server/path/  (protocol prefix)
- C:/no-trailing-slash      (no trailing slash)
- c:/lowercase-drive/       (lowercase drive letter)
- C:/invalid@chars/         (special char @)
- 123-invalid               (no drive/colon)
- (empty)                   (required)
```

---

## Section 8 — Charts / Statistics Page

> Navigate to `/statistic/daily` first.

### 8.1 Daily Report — Pie Chart
1. **Verify**: Page shows a card titled **"Statistic reports"**.
2. **Verify**: A **"Report types"** dropdown is visible.
3. **Verify**: The dropdown contains one option: `Task status counts`.
4. **Verify**: `Task status counts` is already selected.
5. **Verify**: A **pie chart** is displayed (if tasks exist).
6. Inspect the pie chart:
   - **Verify**: The chart legend shows status labels like `Start(N)`, `Inprogress(N)`, `Completed(N)`.
   - **Verify**: Each slice has a distinct color (purple for Start, orange for InProgress, dark green for Completed).
   - **Verify**: The count numbers in the legend match the actual task counts from Section 2.
7. **Verify**: Chart title inside the chart reads `"Counts of Task statuses today"`.

> **Note**: If taskList is empty (no tasks for today), the chart area will not render. Ensure tasks from Section 2 are present.

### 8.2 Weekly Report — All Chart Types
1. Click **"Menu"** → **"In-Weekly"** (URL: `/statistic/weekly`).
2. **Verify**: The **"Report types"** dropdown now contains **three** options:
   - `Task Status counts` (index 0)
   - `Completed tasks in week` (index 1)
   - `Spent time on tasks` (index 2)

#### 8.2.1 Pie Chart (Task Status Counts)
1. Ensure `Task Status counts` is selected in the dropdown (should be default).
2. **Verify**: A **pie chart** is displayed.
3. **Verify**: Chart legend shows status labels with counts: `Start(N)`, `Inprogress(N)`, `Completed(N)`.
4. **Verify**: Chart title reads `"Counts of task statuses in weekly"`.
5. **Verify**: All slices of the pie are visible with distinct colors.

#### 8.2.2 Line Chart — Completed Tasks in Week
1. In the **"Report types"** dropdown, select `Completed tasks in week`.
2. **Verify**: The pie chart disappears and a **line chart** appears.
3. **Verify**: The chart title/legend reads `"Completed task numbers in This week"`.
4. **Verify**: The X-axis shows day labels in format `DayName(MM.DD)` (e.g. `Monday(05.25)`).
5. **Verify**: The Y-axis shows numeric values (count of completed tasks per day).
6. **Verify**: A line with data points is drawn on the chart.

#### 8.2.3 Line Chart — Spent Time on Tasks
1. In the **"Report types"** dropdown, select `Spent time on tasks`.
2. **Verify**: The line chart updates with new data.
3. **Verify**: The chart title/legend reads `"Amount of spent times on the completed tasks in This week"`.
4. **Verify**: The X-axis shows the same day format as in 8.2.2.
5. **Verify**: The Y-axis shows numeric values (total minutes spent per day on completed tasks).
6. **Verify**: The line chart data changes (Y-values reflect time, not count).

### 8.3 Chart Responsiveness
1. On the weekly page, resize the browser window to a narrow width (approx. 600px).
2. **Verify**: The chart resizes and remains readable.
3. Restore the window to full size.

---

## Section 9 — Theme Testing (All Pages)

> Themes are accessible via **Options → Themes** radio buttons.
> Each theme is tested on each page for visual correctness.
> Available themes: `Light`, `Dark`, `BlueDragon`, `firePhoenix`.

### 9.1 Theme: Light (Default)
> This is the default theme. It should already be active on first load.

**On Tasks Page (`/tasks/all`)**:
1. Click **Options** → Verify `Light` radio button is selected.
2. **Verify**: Background is white/light, text is dark.
3. **Verify**: Task cards appear with light styling.
4. **Verify**: Header background is light-colored.

**On Location Page (`/location`)**:
1. Navigate to Location page.
2. **Verify**: Form fields appear with light styling.
3. **Verify**: Page background is white/light.

**On Statistics Daily Page (`/statistic/daily`)**:
1. Navigate to `/statistic/daily`.
2. **Verify**: Chart renders with dark text on light background.
3. **Verify**: Pie chart colors are visible against the light background.

**On Statistics Weekly Page (`/statistic/weekly`)**:
1. Navigate to `/statistic/weekly`.
2. **Verify**: Line chart renders with dark text on light background.
3. Switch through all 3 report types and verify all charts render correctly.

---

### 9.2 Theme: Dark

**Activate Dark Theme**:
1. From any page, click **Options**.
2. Click the **"Dark"** radio button.
3. **Verify**: The page background immediately changes to dark (near-black or very dark gray).
4. **Verify**: Text becomes light/white.
5. **Verify**: The `Dark` radio button is now selected.

**On Tasks Page (`/tasks/all`)**:
1. Navigate to `/tasks/all`.
2. **Verify**: Task cards have dark background with light text.
3. **Verify**: Buttons and input fields have dark styling.
4. **Verify**: Status filter and time period dropdowns are readable in dark mode.
5. **Verify**: Alert messages (if any appear) are styled consistently with dark theme.

**On Location Page (`/location`)**:
1. Navigate to `/location`.
2. **Verify**: Form card backgrounds are dark.
3. **Verify**: Input fields are dark-styled.
4. **Verify**: Error messages are readable in dark theme.

**On Statistics Daily Page (`/statistic/daily`)**:
1. Navigate to `/statistic/daily`.
2. **Verify**: Pie chart renders with light-colored text labels against dark background.
3. **Verify**: Chart legend text is visible.

**On Statistics Weekly Page (`/statistic/weekly`)**:
1. Navigate to `/statistic/weekly`.
2. Switch through all 3 report types.
3. **Verify**: All charts render correctly in dark theme.
4. **Verify**: Line chart grid lines and axis labels are visible (light color).
5. **Verify**: Chart line and data points are visible against dark background.

---

### 9.3 Theme: BlueDragon

**Activate BlueDragon Theme**:
1. Click **Options** → click **"BlueDragon"** radio button.
2. **Verify**: Page theme changes to a blue-toned scheme.
3. **Verify**: `BlueDragon` radio button is selected.

**On Tasks Page (`/tasks/all`)**:
1. **Verify**: Task cards display with blue-dragon theme colors.
2. **Verify**: Buttons have blue-themed styling.
3. **Verify**: Header and navigation are styled with blue tones.

**On Location Page (`/location`)**:
1. Navigate to `/location`.
2. **Verify**: Form inputs and cards show blue-themed styling.

**On Statistics Daily Page (`/statistic/daily`)**:
1. Navigate to `/statistic/daily`.
2. **Verify**: Pie chart is visible with theme-adjusted colors.

**On Statistics Weekly Page (`/statistic/weekly`)**:
1. Navigate to `/statistic/weekly`.
2. Switch through all 3 report types.
3. **Verify**: All charts are visible and text is readable in this theme.

---

### 9.4 Theme: firePhoenix

**Activate firePhoenix Theme**:
1. Click **Options** → click **"firePhoenix"** radio button.
2. **Verify**: Page theme changes to a fire/warm color scheme (reds, oranges).
3. **Verify**: `firePhoenix` radio button is selected.

**On Tasks Page (`/tasks/all`)**:
1. **Verify**: Task cards display with fire-phoenix theme colors.
2. **Verify**: Buttons have warm-colored styling.
3. **Verify**: Header is styled with fire/warm tones.

**On Location Page (`/location`)**:
1. Navigate to `/location`.
2. **Verify**: Form inputs and cards show warm fire-themed styling.

**On Statistics Daily Page (`/statistic/daily`)**:
1. Navigate to `/statistic/daily`.
2. **Verify**: Pie chart is visible with fire-phoenix themed colors.

**On Statistics Weekly Page (`/statistic/weekly`)**:
1. Navigate to `/statistic/weekly`.
2. Switch through all 3 report types.
3. **Verify**: All charts are visible and text is readable.

### 9.5 Theme Persistence on Navigation
1. With `firePhoenix` active, navigate to different pages using the Menu.
2. **Verify**: The theme persists across all route changes.
3. **Verify**: The `firePhoenix` radio button remains selected in Options regardless of which page is active.

### 9.6 Theme Persistence After Reload
1. Activate the **Dark** theme.
2. Reload the browser page (F5 / Ctrl+R).
3. **Verify**: After reload, the **Dark** theme is still active (stored in localStorage).
4. **Verify**: The `Dark` radio button is pre-selected in Options.
5. Reset theme back to **Light** for clean state.

---

## Section 10 — Cross-Page & Edge Case Tests

### 10.1 Task Count Reflects in Charts
1. Note the number of tasks with each status from `/tasks/all`.
2. Navigate to `/statistic/daily`.
3. **Verify**: The pie chart counts match the actual task counts noted in step 1.

### 10.2 Alert Window Behavior
1. Navigate to `/tasks/all`.
2. Trigger a success alert by editing and saving any task.
3. **Verify**: The alert message appears (usually top or bottom of screen).
4. **Verify**: The alert is styled green for success.
5. Wait or interact to see if the alert auto-dismisses.
6. **Record**: Does the alert auto-dismiss? How long does it take?

### 10.3 Page Not Found
1. Navigate to `http://localhost:4200/does-not-exist`.
2. **Verify**: A "Page Not Found" component is shown.
3. **Verify**: The header is still visible and navigation still works.
4. Navigate back to `/tasks/all` via the Menu.

---

## Section 11 — Final Test Results Summary

After completing all sections, the AI agent should compile this summary:

```
=== TEST RESULTS SUMMARY ===

Section 1 — Navigation & Header
  1.1 App Menu:             [ ]
  1.2 Options Menu:         [ ]
  1.3 Unknown Route (404):  [ ]

Section 2 — Task Creation (10 Tasks)
  2.1–2.10 Task creation:   [ ] PASS / [ ] FAIL (list which)
  2.11 Max limit check:     [ ]

Section 3 — Task Editing
  3.1–3.5 Edit scenarios:   [ ] PASS / [ ] FAIL (list which)

Section 4 — Task Activation (InProgress)
  4.1–4.4 Timer activation: [ ] PASS / [ ] FAIL (list which)

Section 5 — Form Validation
  5.1–5.9 Validation tests: [ ] PASS / [ ] FAIL (list which)

Section 6 — Filter Testing
  6.1–6.9 Filter scenarios: [ ] PASS / [ ] FAIL (list which)

Section 7 — Location Page
  7.2 Invalid paths rejected:  [ ] PASS / [ ] FAIL (list which)
  7.3 Valid paths accepted:    [ ] PASS / [ ] FAIL (list which)
  7.4 App settings paths:      [ ] PASS / [ ] FAIL (list which)
  7.5 Enter key save:          [ ]

Section 8 — Charts
  8.1 Daily pie chart:         [ ]
  8.2.1 Weekly pie chart:      [ ]
  8.2.2 Completed tasks line:  [ ]
  8.2.3 Spent time line:       [ ]

Section 9 — Themes
  9.1 Light — all pages:       [ ]
  9.2 Dark — all pages:        [ ]
  9.3 BlueDragon — all pages:  [ ]
  9.4 firePhoenix — all pages: [ ]
  9.5 Theme persistence (nav): [ ]
  9.6 Theme persistence (reload): [ ]

Section 10 — Edge Cases
  10.1 Chart reflects task counts: [ ]
  10.2 Alert window behavior:      [ ]
  10.3 Page Not Found:             [ ]

Total PASS: ___
Total FAIL: ___
Total NOTE: ___

Known Issues Found:
1. ...
2. ...
```

---

## Appendix A — Application Routes Reference

| URL | Component | Description |
|-----|-----------|-------------|
| `/tasks/all` | TaskComponent | All tasks (default page) |
| `/tasks/finished` | TaskComponent | Completed tasks filtered |
| `/statistic/daily` | StatisticComponent | Daily reports (pie chart) |
| `/statistic/weekly` | StatisticComponent | Weekly reports (pie + line charts) |
| `/location` | ChangeLocationComponent | Change data storage paths |
| `/**` | PageNotFoundComponent | 404 not found page |

## Appendix B — Task Status Flow

```
[New Task Created] → Status: Start
      ↓
[Timer Start button clicked] → Status: InProgress (countdown running)
      ↓
[Timer reaches 00:00:00] → Status: Completed
```

- **Start**: Timer button is enabled (if time > 0), card is editable.
- **InProgress**: Card is **readonly** (no edit button). Countdown timer and progress bar visible.
- **Completed**: Card is readonly. No timer visible.

## Appendix C — Validation Rules Reference

### Task Title
- **Pattern**: `[^-0-9]{1}[a-zA-Z0-9-_]+`
- First character: Must NOT be `-` or a digit (`0-9`).
- Allowed characters: letters (a-z, A-Z), digits (0-9), hyphen (`-`), underscore (`_`).
- Minimum length: 3 characters.
- Maximum length: 30 characters.

| Input | Valid? | Reason |
|-------|--------|--------|
| `abc` | ✅ | Min length, valid chars |
| `Task-1` | ✅ | Valid |
| `my_task` | ✅ | Valid |
| `a1` | ❌ | Too short (< 3 chars) |
| `-task` | ❌ | Starts with hyphen |
| `1Task` | ❌ | Starts with digit |
| 31-char string | ❌ | Exceeds max length |

### Task Planned Time (Minutes)
- **Pattern**: `[0-9.]+` (numeric only)
- **Minimum**: 0
- **Maximum**: 1438 (approx. 23h 58min)
- **Required**: Yes

### Location Path
- **Pattern**: `[A-Z]?:/{1}([a-zA-Z0-9-_ ]+/{1})*$`
- Drive letter: optional uppercase `A-Z` followed by `:`
- Must use forward slashes `/`
- Each path segment: letters, digits, hyphens, underscores, spaces
- Must end with `/`

| Input | Valid? |
|-------|--------|
| `C:/users/docs/` | ✅ |
| `D:/my-folder/tasks/` | ✅ |
| `Z:/data/` | ✅ |
| `C:\folder\` | ❌ (backslashes) |
| `c:/lower/` | ❌ (lowercase drive) |
| `C:/no-slash` | ❌ (no trailing slash) |
| `/no-drive/` | ❌ (missing drive) |

## Appendix D — Available Themes

| Theme Key | Display Name | Description |
|-----------|-------------|-------------|
| `Light` | Light | Default white/light theme |
| `Dark` | Dark | Dark/night mode theme |
| `BlueDragon` | BlueDragon | Blue dragon themed |
| `FirePhoenix` | firePhoenix | Fire/warm phoenix theme |

> **Note**: Theme selection is persisted in `localStorage` under key `savedTheme`. It survives page reloads.

Add autosave and loading for the collaborative canvas so project state is persisted before adding AI generation Canvas JSON should be stored in Vercel Blob, and the saved blob URL should be stored on the Prisma project record.

## What to Install

- `@vercel/blob`

## Implementation

1. Check the existing project schema.
   - review `prisma/model/project.prisma`
   - add or reuse a field for the canvas blob URL
   - keep Prisma responsible for metadata only

2. Add canvas save/load API routes.
   Create: `PUT /api/projects/[projectId]/canvas`
   This route should:
   - receive the latest canvas JSON
   - upload the JSON to Vercel Blob
   - store the returned blob URL on the matching Prisma project record

   Create: `GET /api/projects/[projectId]/canvas`
   This route should:
   - read the project’s saved blob URL from Prisma
   - fetch the saved canvas JSON from Vercel Blob
   - return the canvas state to the editor

3. Add an autosave hook in the `/hook` folder.
   - watch the canvas nodes and edges
   - debounce saves to avoid excessive writes
   - save through the canvas API route
   - track save status: saving, saved, error

4. Load saved canvas state in the editor.
   - when the editor loads, check if the Liveblocks room has any existing nodes or edges
   - if the room is empty and the project has a saved canvas blob URL, fetch and load the saved canvas state
   - if the room already has nodes or edges, skip the load entirely to avoid overwriting active collaboration

5. Add a small save status indicator in the editor Save button.
   - show saving, saved, or error states

6. Add an autosave on/off toggle to the editor navbar.
   - client-side session state (not persisted to the project record)
   - defaults to on
   - when turned off, stop scheduling debounced saves and show a manual
     Save button in the navbar instead
   - the manual Save button triggers the same save path (`PUT` route) as
     autosave, immediately rather than debounced
   - turning autosave back on resumes debounced saving on the next canvas
     change
   - while off, if there are edits since the last save, the status
     indicator must not show "Saved" — show a distinct "unsaved changes"
     state instead

7. Warn before losing unsaved changes.
   - when there are unsaved changes and the user tries to navigate to a
     different in-app route (e.g. switching projects from the sidebar, or
     starting a new project) or close/refresh the tab, warn before
     proceeding
   - in-app navigation: show a custom confirm dialog — "You have unsaved
     changes. You'll lose your progress if you proceed." with a Cancel
     button (stay) and a Discard & Leave button (proceed, discarding the
     changes)
   - tab close/refresh: use the browser's native `beforeunload` prompt
     (its wording can't be customized by any site)
   - no warning is needed once there are no unsaved changes, or while
     autosave is on and has already caught up

## Storage Pattern

- Prisma stores project metadata and the canvas blob URL.
- Vercel Blob stores the actual canvas JSON.

## Check When Done

- `@vercel/blob` is installed.
- Project schema supports storing the canvas blob URL.
- Save/load routes use Prisma for metadata and Vercel Blob for canvas JSON.
- Autosave hook debounces canvas saves.
- Editor shows save status.
- Saved canvas does not load if the room already has
  active nodes or edges
- Autosave toggle turns debounced saving off/on; manual Save button only
  appears (and works) while it's off
- Navigating away (in-app) with unsaved changes shows the confirm dialog;
  confirming proceeds, canceling stays
- Closing/refreshing the tab with unsaved changes triggers the browser's
  native unload prompt
- `npm run build` passes.

-- Allow users to update their own diagnoses (for same-day overwrite)
CREATE POLICY "Users can update their own diagnoses"
ON public.diagnoses
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own quantum_commands (for overwrite cleanup)
CREATE POLICY "Users can delete their own commands"
ON public.quantum_commands
FOR DELETE
USING (auth.uid() = user_id);
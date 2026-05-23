from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentSessionRecord:
    """Ai agent session record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_version_id: Optional[str] = None
    approval_policy: Optional[str] = None
    chat_conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    cwd: Optional[str] = None
    data_scope: Optional[str] = None
    default_model: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    execution_mode: Optional[str] = None
    forked_from_run_id: Optional[str] = None
    forked_from_step_id: Optional[str] = None
    git_branch: Optional[str] = None
    git_commit: Optional[str] = None
    id: Optional[str] = None
    last_active_at: Optional[str] = None
    last_run_id: Optional[str] = None
    last_step_id: Optional[str] = None
    memory_space_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    parent_session_id: Optional[str] = None
    permission_mode: Optional[str] = None
    provider_conversation_id: Optional[str] = None
    provider_session_id: Optional[str] = None
    repository_id: Optional[str] = None
    resume_strategy: Optional[str] = None
    run_count: Optional[str] = None
    runtime: Optional[str] = None
    runtime_state_storage_key: Optional[str] = None
    sandbox_policy: Optional[str] = None
    session_code: Optional[str] = None
    session_kind: Optional[str] = None
    source_surface: Optional[str] = None
    status: Optional[str] = None
    step_count: Optional[str] = None
    summary: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    tool_call_count: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
    workspace_id: Optional[str] = None

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "k8s-poc.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "k8s-poc.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "k8s-poc.fullname.server" -}}
{{ include "k8s-poc.fullname" . }}-server
{{- end }}

{{- define "k8s-poc.fullname.serverTwo" -}}
{{ include "k8s-poc.fullname" . }}-server-two
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "k8s-poc.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "k8s-poc.labels" -}}
helm.sh/chart: {{ include "k8s-poc.chart" . }}
{{ include "k8s-poc.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "k8s-poc.labels.server" -}}
{{ include "k8s-poc.labels" . }}
component: "server"
{{- end }}

{{- define "k8s-poc.labels.serverTwo" -}}
{{ include "k8s-poc.labels" . }}
component: "server-two"
{{- end }}

{{/*
Selector labels
*/}}
{{- define "k8s-poc.selectorLabels" -}}
app.kubernetes.io/name: {{ include "k8s-poc.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "k8s-poc.selectorLabels.server" -}}
{{ include "k8s-poc.selectorLabels" . }}
component: "server"
{{- end }}

{{- define "k8s-poc.selectorLabels.serverTwo" -}}
{{ include "k8s-poc.selectorLabels" . }}
component: "server-two"
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "k8s-poc.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "k8s-poc.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
